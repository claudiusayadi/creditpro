import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';

@Entity('careers')
export class Career {
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

  @Column({ type: 'varchar', length: 100, nullable: true })
  type?: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
