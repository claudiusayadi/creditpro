import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from '../../core/common/dto/query.dto';
import { IPaginatedResult } from '../../core/common/interfaces/paginated-result.interface';
import { QB } from '../../core/common/utils/query-builder.util';
import { slugify } from '../../core/common/utils/slugify';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career } from './entities/career.entity';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career) private readonly careersRepo: Repository<Career>,
  ) {}

  public async create(dto: CreateCareerDto): Promise<Career> {
    const slug = dto.slug || slugify(dto.title);
    const career = this.careersRepo.create({ ...dto, slug });
    return await this.careersRepo.save(career);
  }

  public async findAll(query: QueryDto): Promise<IPaginatedResult<Career>> {
    return await QB.paginate(this.careersRepo, query, {
      defaultSearchFields: ['title', 'description', 'location'],
    });
  }

  public async findActive(query: QueryDto): Promise<IPaginatedResult<Career>> {
    return await QB.paginate(this.careersRepo, query, {
      defaultSearchFields: ['title', 'description', 'location'],
      additionalWhere: { active: true },
    });
  }

  public async findOne(id: string): Promise<Career> {
    return await this.careersRepo.findOneOrFail({ where: { id } });
  }

  public async findBySlug(slug: string): Promise<Career> {
    return await this.careersRepo.findOneOrFail({ where: { slug } });
  }

  public async update(id: string, dto: UpdateCareerDto): Promise<Career> {
    const career = await this.findOne(id);

    const updateData = { ...dto };
    if (dto.slug) {
      updateData.slug = dto.slug;
    }

    const updatedCareer = await this.careersRepo.preload({
      id: career.id,
      ...updateData,
    });

    if (!updatedCareer) throw new NotFoundException('Career not found');
    return await this.careersRepo.save(updatedCareer);
  }

  public async remove(id: string): Promise<void> {
    const career = await this.findOne(id);
    await this.careersRepo.softDelete(career.id);
  }
}
