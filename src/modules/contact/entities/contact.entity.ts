import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RegistryDates } from '../../../core/common/dto/registry-dates.dto';
import { ContactStatus } from '../enums/contact-status.enum';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    enumName: 'contact_status',
    default: ContactStatus.NEW,
  })
  status: ContactStatus;

  @Column({ type: 'text', nullable: true })
  admin_notes?: string;

  @Column(() => RegistryDates, { prefix: false })
  registry: RegistryDates;
}
