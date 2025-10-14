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
   * Category description
   * @example "Articles related to technology"
   */
  @IsString()
  @IsOptional()
  description?: string;
}
