import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userObject: CreateUserDto) {
    return this.authService.register(userObject);
  }

  @Post('login')
  login(@Body() userObject: LoginAuthDto) {
    return this.authService.login(userObject);
  }
}
