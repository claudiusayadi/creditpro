import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Start date is required.' })
  start_date: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end_date?: Date;

  @IsUrl({}, { message: 'Invalid image URL.' })
  @IsOptional()
  image_url?: string;

  @IsUrl({}, { message: 'Invalid registration URL.' })
  @IsOptional()
  registration_url?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean = true;

  @IsBoolean()
  @IsOptional()
  featured?: boolean = false;
}
