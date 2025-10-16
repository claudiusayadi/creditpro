import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Media } from './entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { FileValidationService } from './validators/file-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), ConfigModule],
  controllers: [MediaController],
  providers: [MediaService, FileValidationService],
  exports: [MediaService, FileValidationService],
})
export class MediaModule {}
