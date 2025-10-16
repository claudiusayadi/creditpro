import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  /**
   * Job location
   * @example "Remote"
   */
  @IsString()
  @IsOptional()
  location?: string;

  /**
   * Job type
   * @example "Full-time"
   */
  @IsString()
  @IsOptional()
  type?: string;

  /**
   * Whether the job is active
   * @example true
   */
  @IsBoolean()
  @IsOptional()
  active?: boolean = true;
}
