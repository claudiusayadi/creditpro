import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';
import { MediaType } from '../interfaces/media.interface';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  original_filename: string;

  @Column({ type: 'varchar', length: 500 })
  file_path: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 100 })
  mime_type: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({
    type: 'enum',
    enum: MediaType,
    enumName: 'media_type',
  })
  type: MediaType;

  @Column({ type: 'varchar', length: 10 })
  extension: string;

  @Column({ type: 'varchar', length: 4 })
  year: string;

  @Column({ type: 'varchar', length: 2 })
  month: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt_text?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
