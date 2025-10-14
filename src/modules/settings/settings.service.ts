import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/core/common/dto/query.dto';
import type { PaginatedResult } from 'src/core/common/interfaces/paginated-result.interface';
import { PaginationUtil } from 'src/core/common/utils/pagination.util';
import type { CreateSettingDto } from './dto/create-setting.dto';
import type { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
  ) {}

  async create(dto: CreateSettingDto): Promise<Setting> {
    const existing = await this.settingRepo.findOne({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(
        `Setting with key "${dto.key}" already exists`,
      );
    }

    const setting = this.settingRepo.create(dto);
    return await this.settingRepo.save(setting);
  }

  async findAll(query: QueryDto): Promise<PaginatedResult<Setting>> {
    return await PaginationUtil.paginate(this.settingRepo, {
      pagination: query,
      sort: query,
    });
  }

  async findPublic(): Promise<Setting[]> {
    return await this.settingRepo.find({
      where: { is_public: true },
      select: ['id', 'key', 'value', 'group', 'description'],
    });
  }

  async findByGroup(group: string): Promise<Setting[]> {
    return await this.settingRepo.find({
      where: { group },
      order: { key: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Setting> {
    const setting = await this.settingRepo.findOne({ where: { id } });

    if (!setting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }

    return setting;
  }

  async findByKey(key: string): Promise<Setting | null> {
    return await this.settingRepo.findOne({ where: { key } });
  }

  async getValue(key: string, defaultValue?: string): Promise<string | null> {
    const setting = await this.findByKey(key);
    return setting ? setting.value : (defaultValue ?? null);
  }

  async update(id: string, dto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.findOne(id);

    if (dto.key && dto.key !== setting.key) {
      const existing = await this.settingRepo.findOne({
        where: { key: dto.key },
      });

      if (existing) {
        throw new ConflictException(
          `Setting with key "${dto.key}" already exists`,
        );
      }
    }

    const updated = await this.settingRepo.preload({
      id: setting.id,
      ...dto,
    });

    if (!updated) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }

    return await this.settingRepo.save(updated);
  }

  async updateByKey(key: string, value: string): Promise<Setting> {
    const setting = await this.settingRepo.findOne({ where: { key } });

    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    setting.value = value;
    return await this.settingRepo.save(setting);
  }

  async remove(id: string): Promise<void> {
    const setting = await this.findOne(id);
    await this.settingRepo.remove(setting);
  }
}
