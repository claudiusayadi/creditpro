import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from '../../core/common/dto/query.dto';
import { PaginatedResult } from '../../core/common/interfaces/paginated-result.interface';
import { PaginationUtil } from '../../core/common/utils/pagination.util';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career } from './entities/career.entity';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career) private readonly careersRepo: Repository<Career>,
  ) {}

  public async create(dto: CreateCareerDto): Promise<Career> {
    const career = this.careersRepo.create(dto);
    return await this.careersRepo.save(career);
  }

  public async findAll(query: QueryDto): Promise<PaginatedResult<Career>> {
    return await PaginationUtil.paginate(this.careersRepo, {
      pagination: query,
      sort: query,
    });
  }

  public async findOne(id: string): Promise<Career> {
    return await this.careersRepo.findOneOrFail({ where: { id } });
  }

  public async update(id: string, dto: UpdateCareerDto): Promise<Career> {
    const career = await this.findOne(id);
    const updatedCareer = await this.careersRepo.preload({
      id: career.id,
      ...dto,
    });

    if (!updatedCareer) throw new NotFoundException('Career not found');
    return await this.careersRepo.save(career);
  }

  public async remove(id: string): Promise<void> {
    const career = await this.findOne(id);
    await this.careersRepo.remove(career);
  }
}
