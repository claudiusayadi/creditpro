import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/core/common/dto/query.dto';
import type { IPaginatedResult } from 'src/core/common/interfaces/paginated-result.interface';
import { QB } from 'src/core/common/utils/query-builder.util';
import type { CreateContactDto } from './dto/create-contact.dto';
import type { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { ContactStatus } from './enums/contact-status.enum';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepo.create(dto);
    return await this.contactRepo.save(contact);
  }

  async findAll(query: QueryDto): Promise<IPaginatedResult<Contact>> {
    return await QB.paginate(this.contactRepo, query, {
      defaultSearchFields: ['name', 'email', 'subject', 'message'],
    });
  }

  async findByStatus(
    status: ContactStatus,
    query: QueryDto,
  ): Promise<IPaginatedResult<Contact>> {
    return await QB.paginate(this.contactRepo, query, {
      defaultSearchFields: ['name', 'email', 'subject', 'message'],
      additionalWhere: { status },
    });
  }

  async findOne(id: string): Promise<Contact> {
    return await this.contactRepo.findOneOrFail({ where: { id } });
  }

  async update(id: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);
    const updatedContact = await this.contactRepo.preload({
      id: contact.id,
      ...dto,
    });

    if (!updatedContact) throw new NotFoundException('Contact not found');
    return await this.contactRepo.save(updatedContact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepo.softDelete(contact.id);
  }

  async getStats(): Promise<{
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
  }> {
    const [total, newCount, read, replied, archived] = await Promise.all([
      this.contactRepo.count(),
      this.contactRepo.count({ where: { status: ContactStatus.NEW } }),
      this.contactRepo.count({ where: { status: ContactStatus.READ } }),
      this.contactRepo.count({ where: { status: ContactStatus.REPLIED } }),
      this.contactRepo.count({ where: { status: ContactStatus.ARCHIVED } }),
    ]);

    return { total, new: newCount, read, replied, archived };
  }
}
