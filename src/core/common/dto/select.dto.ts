import { IsArray, IsOptional, IsString } from 'class-validator';

/**
 * Field selection DTO for controlling which fields to return
 */
export class SelectDto {
  /**
   * Fields to include in response (if not provided, returns all fields)
   * @example ['id', 'first_name', 'email']
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  select?: string[];
  /**
   * Fields to exclude from response
   * @example ['password', 'token']
   */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exclude?: string[];
}
