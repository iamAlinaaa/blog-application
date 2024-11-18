import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('postId') postId: number,
    @Body() content: { content: string; authorName: string },
  ): Promise<Comment> {
    return this.commentsService.create(
      postId,
      content.content,
      content.authorName,
    );
  }

  @Get()
  findByPost(@Param('postId') postId: number): Promise<Comment[]> {
    return this.commentsService.findByPost(postId);
  }
}
