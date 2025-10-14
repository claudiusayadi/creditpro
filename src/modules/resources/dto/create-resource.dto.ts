import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Type is required.' })
  @MaxLength(100)
  type: string;

  @IsUrl({}, { message: 'Invalid file URL.' })
  @IsNotEmpty({ message: 'File URL is required.' })
  file_url: string;

  @IsUrl({}, { message: 'Invalid thumbnail URL.' })
  @IsOptional()
  thumbnail_url?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  file_size?: number;

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean = true;
}

