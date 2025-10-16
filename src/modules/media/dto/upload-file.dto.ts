import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  alt_text?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
