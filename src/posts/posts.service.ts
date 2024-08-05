import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { userRoles } from 'src/utils/constants';
import axios from 'axios';

@Injectable()
export class PostsService {
  async createPost(createPostDto: CreatePostDto, userType: number) {
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
          data: createPostDto,
        },
      );

      return {
        ...createPost.data.data,
        id: createPost.data.id,
      };
    } catch (err) {
      throw new HttpException(err.response.data, err.response.status);
    }
  }

  async findAll() {
    const posts = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return posts.data;
  }

  async postsByUser(id: number) {
    if (!id) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const post = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?userId=${id}`,
    );
    return post.data;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto, userType: number) {
    if (!id) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userRole = userRoles[userType] || 'user';

    if (userRole !== 'admin') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const post = await axios.put(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        data: updatePostDto,
      },
    );

    return post.data.data;
  }
}
