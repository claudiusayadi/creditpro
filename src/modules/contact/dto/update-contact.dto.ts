import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ContactStatus } from '../enums/contact-status.enum';

export class UpdateContactDto {
  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;

  @IsString()
  @IsOptional()
  admin_notes?: string;
}

