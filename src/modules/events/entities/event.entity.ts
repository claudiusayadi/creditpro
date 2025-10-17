import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';
import { Media } from '../../media/entities/media.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'end_date' })
  endDate?: Date;

  @ManyToOne(() => Media, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  image?: Media;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'registration_url',
  })
  registrationUrl?: string;

  @Column({ type: 'boolean', default: true })
  published: boolean;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
