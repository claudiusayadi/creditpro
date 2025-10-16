import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  /**
   * Name of the person sending the message
   * @example "John Doe"
   */
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @MaxLength(255)
  name: string;

  /**
   * Email address of the person sending the message
   * @example "john.doe@example.com"
   */
  @IsEmail({}, { message: 'Invalid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  /**
   * Phone number of the person sending the message
   * @example "+2349012345678"
   */
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  /**
   * Subject of the message
   * @example "I have a question"
   */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  subject?: string;

  /**
   * Message content
   * @example "Hello, I have a question about your product."
   */
  @IsString()
  @IsNotEmpty({ message: 'Message is required.' })
  message: string;
}
