import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './post.entity';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return this.postsRepository.find();
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }
  async create(
    title: string,
    content: string,
    authorName: string,
  ): Promise<PostEntity> {
    const post = this.postsRepository.create({
      title,
      content,
      authorName,
    });
    return this.postsRepository.save(post);
  }

  async update(
    id: number,
    title: string,
    content: string,
  ): Promise<PostEntity> {
    await this.postsRepository.update(id, { title, content });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    await this.postsRepository.remove(post);
  }
}
