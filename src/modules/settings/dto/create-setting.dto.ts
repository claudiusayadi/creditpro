import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSettingDto {
  @IsString()
  @IsNotEmpty({ message: 'Key is required.' })
  @MaxLength(100)
  key: string;

  @IsString()
  @IsNotEmpty({ message: 'Value is required.' })
  value: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  group?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_public?: boolean = false;
}
