import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
   * @example "This is the content of the blog post."
   */
  @IsString()
  @IsNotEmpty({ message: 'Content is required.' })
  content: string;

  /**
   * Blog slug (optional, auto-generated if not provided)
   * @example "my-first-blog-post"
   */
  @IsString()
  @IsOptional()
  slug?: string;

  /**
   * Whether the blog is published
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  published?: boolean = true;
}
