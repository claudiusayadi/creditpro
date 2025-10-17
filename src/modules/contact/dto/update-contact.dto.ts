import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ContactStatus } from '../enums/contact-status.enum';

export class UpdateContactDto {
  /**
   * Status of the contact message
   * @example "read"
   */
  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;

  /**
   * Admin notes
   * @example "This message is spam."
   */
  @IsString()
  @IsOptional()
  adminNotes?: string;
}
