import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateBlogDto {
  /**
   * Blog title
   * @example "My First Blog Post"
   */
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  /**
   * Blog content
   * @example "This is the content of my first blog post."
   */
  @IsString()
  @IsNotEmpty({ message: 'Content is required.' })
  content: string;

  /**
   * Blog slug (auto-generated from title if not provided)
   * @example "my-first-blog-post"
   */
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
