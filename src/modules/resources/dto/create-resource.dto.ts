import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

import { IsBoolean } from '../../../core/common/decorators/is-boolean.decorator';

export class CreateResourceDto {
  /**
   * Resource title
   * @example "My First Resource"
   */
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  @MaxLength(255)
  title: string;

  /**
   * Resource slug (auto-generated from title if not provided)
   * @example "my-first-resource"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  /**
   * Resource description
   * @example "This is the description of my first resource."
   */
  @IsString()
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Type is required.' })
  @MaxLength(100)
  type: string;

  /**
   * Resource file URL
   * @example "https://example.com/file.pdf"
   */
  @IsUrl({}, { message: 'Invalid file URL.' })
  @IsNotEmpty({ message: 'File URL is required.' })
  file_url: string;

  /**
   * Resource thumbnail URL
   * @example "https://example.com/thumbnail.jpg"
   */
  @IsUrl({}, { message: 'Invalid thumbnail URL.' })
  @IsOptional()
  thumbnail_url?: string;

  /**
   * Resource file size in bytes
   * @example 1024
   */
  @IsNumber()
  @Min(0)
  @IsOptional()
  file_size?: number;

  /**
   * Resource category ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsUUID()
  @IsOptional()
  category_id?: string;

  /**
   * Whether the resource is published
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  published?: boolean = true;
}
