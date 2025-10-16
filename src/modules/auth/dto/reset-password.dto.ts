import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

import { CreateUserDto } from '../../users/dto/create-user.dto';

export class ResetPasswordDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {
  /**
   * 6-digit password reset code
   * @example "123456"
   */
  @IsString()
  @Length(6, 6)
  @IsNotEmpty({ message: 'Reset code is required.' })
  code: string;
}
