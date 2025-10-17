import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { IsBoolean } from '../../../core/common/decorators/is-boolean.decorator';

export class CreateEventDto {
  /**
   * Event title
   * @example "My First Event"
   */
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  @MaxLength(255)
  title: string;

  /**
   * Event slug (auto-generated from title if not provided)
   * @example "my-first-event"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  /**
   * Event description
   * @example "This is the description of my first event."
   */
  @IsString()
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  /**
   * Event location
   * @example "Online"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  /**
   * Event start date
   * @example "2023-10-01T12:00:00Z"
   */
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Start date is required.' })
  startDate: Date;

  /**
   * Event end date
   * @example "2023-10-01T12:00:00Z"
   */
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsUUID()
  @IsOptional()
  imageId?: string;

  @IsUrl({}, { message: 'Invalid registration URL.' })
  @IsOptional()
  registrationUrl?: string;

  /**
   * Whether the event is published
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  published?: boolean = true;

  /**
   * Whether the event is featured
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  featured?: boolean = false;
}
