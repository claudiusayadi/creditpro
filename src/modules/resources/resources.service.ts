import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/core/common/dto/query.dto';
import type { IPaginatedResult } from 'src/core/common/interfaces/paginated-result.interface';
import { QB } from 'src/core/common/utils/query-builder.util';
import { slugify } from 'src/core/common/utils/slugify';
import type { CreateResourceDto } from './dto/create-resource.dto';
import type { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepo: Repository<Resource>,
  ) {}

  async create(dto: CreateResourceDto): Promise<Resource> {
    const slug = dto.slug || slugify(dto.title);
    const resource = this.resourceRepo.create({ ...dto, slug });
    return await this.resourceRepo.save(resource);
  }

  async findAll(query: QueryDto): Promise<IPaginatedResult<Resource>> {
    return await QB.paginate(this.resourceRepo, query, {
      defaultSearchFields: ['title', 'description'],
      additionalRelations: ['category'],
    });
  }

  async findPublished(query: QueryDto): Promise<IPaginatedResult<Resource>> {
    return await QB.paginate(this.resourceRepo, query, {
      defaultSearchFields: ['title', 'description'],
      additionalWhere: { published: true },
      additionalRelations: ['category'],
    });
  }

  async findByCategory(
    categoryId: string,
    query: QueryDto,
  ): Promise<IPaginatedResult<Resource>> {
    return await QB.paginate(this.resourceRepo, query, {
      defaultSearchFields: ['title', 'description'],
      additionalWhere: { category: { id: categoryId }, published: true },
      additionalRelations: ['category'],
    });
  }

  async findByType(
    type: string,
    query: QueryDto,
  ): Promise<IPaginatedResult<Resource>> {
    return await QB.paginate(this.resourceRepo, query, {
      defaultSearchFields: ['title', 'description'],
      additionalWhere: { type, published: true },
      additionalRelations: ['category'],
    });
  }

  async findOne(id: string): Promise<Resource> {
    return await this.resourceRepo.findOneOrFail({
      where: { id },
      relations: { category: true },
    });
  }

  async findBySlug(slug: string): Promise<Resource> {
    return await this.resourceRepo.findOneOrFail({
      where: { slug },
      relations: { category: true },
    });
  }

  async update(id: string, dto: UpdateResourceDto): Promise<Resource> {
    const resource = await this.findOne(id);

    const updateData = { ...dto };
    if (dto.slug) updateData.slug = dto.slug;

    const updated = await this.resourceRepo.preload({
      id: resource.id,
      ...updateData,
    });

    if (!updated) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return await this.resourceRepo.save(updated);
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.resourceRepo.increment({ id }, 'download_count', 1);
  }

  async remove(id: string): Promise<void> {
    const resource = await this.findOne(id);
    await this.resourceRepo.softDelete(resource.id);
  }
}
