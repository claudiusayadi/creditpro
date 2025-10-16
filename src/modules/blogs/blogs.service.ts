import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from '../../core/common/dto/query.dto';
import { IPaginatedResult } from '../../core/common/interfaces/paginated-result.interface';
import { QB } from '../../core/common/utils/query-builder.util';
import { IRequestUser } from '../users/interfaces/user.interface';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly postRepo: Repository<Blog>,
  ) {}

  public async create(dto: CreateBlogDto, author: IRequestUser): Promise<Blog> {
    const blog = this.postRepo.create({ ...dto, author });
    return await this.postRepo.save(blog);
  }

  public async findAll(query: QueryDto): Promise<IPaginatedResult<Blog>> {
    return await QB.paginate(this.postRepo, query, {
      defaultSearchFields: ['title', 'content'],
      additionalRelations: ['author', 'category'],
    });
  }

  public async findPublished(query: QueryDto): Promise<IPaginatedResult<Blog>> {
    return await QB.paginate(this.postRepo, query, {
      defaultSearchFields: ['title', 'content'],
      additionalWhere: { published: true },
      additionalRelations: ['author', 'category'],
    });
  }

  public async findByCategory(
    categoryId: string,
    query: QueryDto,
  ): Promise<IPaginatedResult<Blog>> {
    return await QB.paginate(this.postRepo, query, {
      defaultSearchFields: ['title', 'content'],
      additionalWhere: { category: { id: categoryId }, published: true },
      additionalRelations: ['author', 'category'],
    });
  }

  public async findOne(id: string): Promise<Blog> {
    return await this.postRepo.findOneOrFail({
      where: { id },
      relations: { author: true, category: true },
    });
  }

  public async update(id: string, dto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);
    const updatedBlog = await this.postRepo.preload({ id: blog.id, ...dto });

    if (!updatedBlog) throw new NotFoundException('Blog not found');
    return await this.postRepo.save(updatedBlog);
  }

  public async remove(id: string): Promise<void> {
    const blog = await this.findOne(id);
    await this.postRepo.remove(blog);
  }
}
