import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { QueryDto } from 'src/core/common/dto/query.dto';
import type { IPaginatedResult } from 'src/core/common/interfaces/paginated-result.interface';
import { QB } from 'src/core/common/utils/query-builder.util';
import { slugify } from 'src/core/common/utils/slugify';
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
    const slug = dto.slug || slugify(dto.title);
    const event = this.eventRepo.create({ ...dto, slug });
    return await this.eventRepo.save(event);
  }

  async findAll(query: QueryDto): Promise<IPaginatedResult<Event>> {
    return await QB.paginate(this.eventRepo, query, {
      defaultSearchFields: ['title', 'description', 'location'],
    });
  }

  async findPublished(query: QueryDto): Promise<IPaginatedResult<Event>> {
    return await QB.paginate(this.eventRepo, query, {
      defaultSearchFields: ['title', 'description', 'location'],
      additionalWhere: { published: true },
    });
  }

  async findUpcoming(query: QueryDto): Promise<IPaginatedResult<Event>> {
    return await QB.paginate(this.eventRepo, query, {
      defaultSearchFields: ['title', 'description', 'location'],
      additionalWhere: {
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

  async findBySlug(slug: string): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { slug } });
    if (!event) {
      throw new NotFoundException(`Event with slug ${slug} not found`);
    }
    return event;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    const updateData = { ...dto };
    if (dto.slug) {
      updateData.slug = dto.slug;
    }

    const updated = await this.eventRepo.preload({
      id: event.id,
      ...updateData,
    });

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
