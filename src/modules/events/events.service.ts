import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { QueryDto } from 'src/core/common/dto/query.dto';
import type { PaginatedResult } from 'src/core/common/interfaces/paginated-result.interface';
import { PaginationUtil } from 'src/core/common/utils/pagination.util';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventRepo.create(dto);
    return await this.eventRepo.save(event);
  }

  async findAll(query: QueryDto): Promise<PaginatedResult<Event>> {
    return await PaginationUtil.paginate(this.eventRepo, {
      pagination: query,
      sort: query,
    });
  }

  async findPublished(query: QueryDto): Promise<PaginatedResult<Event>> {
    return await PaginationUtil.paginate(this.eventRepo, {
      pagination: query,
      sort: query,
      where: { published: true },
    });
  }

  async findUpcoming(query: QueryDto): Promise<PaginatedResult<Event>> {
    return await PaginationUtil.paginate(this.eventRepo, {
      pagination: query,
      sort: query,
      where: {
        published: true,
        start_date: MoreThanOrEqual(new Date()),
      },
    });
  }

  async findFeatured(): Promise<Event[]> {
    return await this.eventRepo.find({
      where: {
        published: true,
        featured: true,
        start_date: MoreThanOrEqual(new Date()),
      },
      order: { start_date: 'ASC' },
      take: 5,
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    const updated = await this.eventRepo.preload({ id: event.id, ...dto });

    if (!updated) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return await this.eventRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepo.softDelete(event.id);
  }
}

