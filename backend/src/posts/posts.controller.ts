import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Post()
  create(
    @Body() postData: { title: string; content: string; authorName: string },
  ): Promise<PostEntity> {
    return this.postsService.create(
      postData.title,
      postData.content,
      postData.authorName,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() postData: { title: string; content: string },
  ): Promise<PostEntity> {
    return this.postsService.update(id, postData.title, postData.content);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.postsService.remove(id);
  }
}
