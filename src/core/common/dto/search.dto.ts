import { IsArray, IsOptional, IsString } from 'class-validator';

/**
 * Search DTO for full-text search across multiple fields
 */
export class SearchDto {
  /**
   * Search query string
   * @example "john doe"
   */
  @IsString()
  @IsOptional()
  search?: string;

  /**
   * Fields to search in (if not provided, searches all searchable fields)
   * @example ['first_name', 'email', 'description']
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  searchFields?: string[];
}
