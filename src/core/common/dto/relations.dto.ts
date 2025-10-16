import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class RelationsDto {
  @ApiPropertyOptional({
    description: 'Relations to load (dot notation for nested relations)',
    example: ['profile', 'posts', 'posts.comments'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  relations?: string[];

  @ApiPropertyOptional({
    description: 'Load all available relations',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  loadAll?: boolean = false;
}
