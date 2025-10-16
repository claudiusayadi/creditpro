import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  registration_url?: string;

  @Column({ type: 'boolean', default: true })
  published: boolean;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
