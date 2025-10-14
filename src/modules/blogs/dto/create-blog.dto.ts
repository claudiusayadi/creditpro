import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required.' })
  content: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsUrl({}, { message: 'Invalid image URL.' })
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean = true;

  @IsBoolean()
  @IsOptional()
  featured?: boolean = false;
}
