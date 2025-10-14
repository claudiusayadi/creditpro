import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IRequestUser } from 'src/modules/users/interfaces/user.interface';
import { QueryDto } from '../../core/common/dto/query.dto';
import { PaginatedResult } from '../../core/common/interfaces/paginated-result.interface';
import { PaginationUtil } from '../../core/common/utils/pagination.util';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blogs.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly postRepo: Repository<Blog>,
  ) {}

  public async create(dto: CreateBlogDto, author: IRequestUser): Promise<Blog> {
    const blog = this.postRepo.create({ ...dto, author });
    return await this.postRepo.save(blog);
  }

  public async findAll(query: QueryDto): Promise<PaginatedResult<Blog>> {
    return await PaginationUtil.paginate(this.postRepo, {
      pagination: query,
      sort: query,
      relations: { author: true },
    });
  }

  public async findOne(id: string): Promise<Blog> {
    return await this.postRepo.findOneOrFail({
      where: { id },
      relations: { author: true },
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
