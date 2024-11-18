import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async findByPost(postId: number): Promise<Comment[]> {
    const comments = await this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['post'],
    });

    return comments;
  }

  async create(
    postId: number,
    content: string,
    authorName: string,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    const comment = this.commentsRepository.create({
      content,
      authorName,
      post,
    });

    return this.commentsRepository.save(comment);
  }
}
