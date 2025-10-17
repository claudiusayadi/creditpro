import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
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

  @IsUUID()
  @IsNotEmpty({ message: 'File ID is required.' })
  fileId: string;

  @IsUUID()
  @IsOptional()
  thumbnailId?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  /**
   * Whether the resource is published
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  published?: boolean = true;
}
