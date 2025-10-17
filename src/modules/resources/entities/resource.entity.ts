import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';
import { Category } from '../../categories/entities/category.entity';
import { Media } from '../../media/entities/media.entity';

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

  @ManyToOne(() => Media, { nullable: false })
  @JoinColumn({ name: 'file_id' })
  file: Media;

  @ManyToOne(() => Media, { nullable: true })
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail?: Media;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ type: 'boolean', default: true })
  published: boolean;

  @Column({ type: 'int', default: 0, name: 'download_count' })
  downloadCount: number;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
