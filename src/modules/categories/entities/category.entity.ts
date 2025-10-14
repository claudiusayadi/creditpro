import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
