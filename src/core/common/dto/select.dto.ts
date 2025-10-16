import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

/**
 * Field selection DTO for controlling which fields to return
 */
export class SelectDto {
  @ApiPropertyOptional({
    description:
      'Fields to include in response (if not provided, returns all fields)',
    example: ['id', 'name', 'email'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  select?: string[];

  @ApiPropertyOptional({
    description: 'Fields to exclude from response',
    example: ['password', 'token'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exclude?: string[];
}
