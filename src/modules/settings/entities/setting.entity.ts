import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  group?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  is_public: boolean;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
