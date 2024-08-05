import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import prisma from 'src/utils/prisma.server';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      if (!createUserDto.email || !createUserDto.password) {
        throw new HttpException(
          'Email and password are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkUser = await prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (checkUser) {
        throw new HttpException(
          'User with this mail already exists',
          HttpStatus.CONFLICT,
        );
      }

      const user = await prisma.user.create({
        data: createUserDto,
      });
      return user;
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    const users = await prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.checkUser(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });

    return user;
  }

  async remove(id: number) {
    const user = prisma.user.delete({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async checkUser(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
