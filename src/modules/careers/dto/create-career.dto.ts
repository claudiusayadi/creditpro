import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCareerDto {
  /**
   * Job title
   * @example "Software Engineer"
   */
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  /**
   * Job slug (auto-generated from title if not provided)
   * @example "software-engineer"
   */
  @IsString()
  @IsOptional()
  slug?: string;

  /**
   * Job description
   * @example "We are looking for a software engineer to join our team."
   */
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
