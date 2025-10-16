import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

/**
 * Search DTO for full-text search across multiple fields
 */
export class SearchDto {
  @ApiPropertyOptional({
    description: 'Search query string',
    example: 'john doe',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description:
      'Fields to search in (if not provided, searches all searchable fields)',
    example: ['name', 'email', 'description'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  searchFields?: string[];
}
