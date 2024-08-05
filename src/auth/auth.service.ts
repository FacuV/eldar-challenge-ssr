import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import prisma from 'src/utils/prisma.server';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtAuthService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerAuthDto: CreateUserDto) {
    const { password } = registerAuthDto;

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hash(password, 10);
    registerAuthDto = {
      ...registerAuthDto,
      password: hashedPassword,
    };

    return this.usersService.create(registerAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { email, password } = loginAuthDto;
      if (!email) {
        throw new HttpException(
          'Email or dni is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!password) {
        throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
      }

      const isEmail = email.includes('@') && email.includes('.');

      if (!isEmail) {
        throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
      }

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          name: true,
          middleName: true,
          lastName: true,
          email: true,
          password: true,
          type: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
      }

      const payload = {
        id: user.id,
        email: user.email,
        type: user.type,
      };

      const token = this.jwtAuthService.sign(payload);

      return {
        user: {
          id: user.id,
          name: user.name,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          type: user.type,
        },
        token,
      };
    } catch (err) {
      throw new HttpException(
        'Error logging in: ' + err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
