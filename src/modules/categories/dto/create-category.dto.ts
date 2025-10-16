import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  /**
   * Category name
   * @example "Technology"
   */
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  /**
   * Category slug (auto-generated from name if not provided)
   * @example "technology"
   */
  @IsString()
  @IsOptional()
  slug?: string;

  /**
   * Category description
   * @example "Articles related to technology"
   */
  @IsString()
  @IsOptional()
  description?: string;
}
