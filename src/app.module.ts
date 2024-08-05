import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [UsersModule, AuthModule, JwtModule, PostsModule],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
