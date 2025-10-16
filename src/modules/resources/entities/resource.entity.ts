import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';
import { Category } from '../../categories/entities/category.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 500 })
  file_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'bigint', nullable: true })
  file_size?: number;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ type: 'boolean', default: true })
  published: boolean;

  @Column({ type: 'int', default: 0 })
  download_count: number;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
