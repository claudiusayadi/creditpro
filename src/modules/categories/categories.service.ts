import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from '../../core/common/dto/query.dto';
import { PaginatedResult } from '../../core/common/interfaces/paginated-result.interface';
import { PaginationUtil } from '../../core/common/utils/pagination.util';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  public async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(category);
  }

  public async findAll(query: QueryDto): Promise<PaginatedResult<Category>> {
    return await PaginationUtil.paginate(this.categoryRepo, {
      pagination: query,
      sort: query,
    });
  }

  public async findOne(id: string): Promise<Category> {
    return await this.categoryRepo.findOneOrFail({ where: { id } });
  }

  public async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    const updatedCategory = await this.categoryRepo.preload({
      id: category.id,
      ...dto,
    });

    if (!updatedCategory) throw new NotFoundException('Category not found');
    return await this.categoryRepo.save(category);
  }

  public async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }
}
