import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { userRoles } from 'src/utils/constants';
import axios from 'axios';

@Injectable()
export class PostsService {
  async create(createPostDto: CreatePostDto, userType: number, userId: number) {
    const userRole = userRoles[userType];

    if (userRole !== 'admin') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      const createPost = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          data: {
            ...createPostDto,
            userId,
          },
        },
      );

      return createPost.data.data;
    } catch (err) {
      throw new HttpException(err.response.data, err.response.status);
    }
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
