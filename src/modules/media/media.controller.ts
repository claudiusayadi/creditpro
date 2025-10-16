import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { IdDto } from '../../core/common/dto/id.dto';
import { QueryDto } from '../../core/common/dto/query.dto';
import {
  bulkDeleteSchema,
  multipleFilesUploadSchema,
  singleFileUploadSchema,
} from '../../core/swagger/media-schemas';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { multerConfig } from './config/multer.config';
import { UpdateMediaDto } from './dto/update-media.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { Media } from './entities/media.entity';
import { MediaType } from './interfaces/media.interface';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({ summary: 'Upload a single file (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(singleFileUploadSchema)
  @ApiCreatedResponse({
    description: 'File uploaded successfully',
    type: Media,
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Roles(UserRole.ADMIN)
  @Post('upload')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ): Promise<Media> {
    if (!file) throw new BadRequestException('No file provided');

    return await this.mediaService.create(file, dto);
  }

  @ApiOperation({ summary: 'Upload multiple files (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(multipleFilesUploadSchema)
  @ApiCreatedResponse({
    description: 'Files uploaded successfully',
    type: [Media],
  })
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  @Roles(UserRole.ADMIN)
  @Post('upload/multiple')
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UploadFileDto,
  ): Promise<Media[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return await this.mediaService.createMultiple(files, dto);
  }

  @ApiOperation({ summary: 'Get all media files' })
  @ApiOkResponse({ description: 'List of media files', type: [Media] })
  @Public()
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.mediaService.findAll(query);
  }

  @ApiOperation({ summary: 'Get media statistics (Admin only)' })
  @ApiOkResponse({ description: 'Media statistics' })
  @Roles(UserRole.ADMIN)
  @Get('stats')
  async getStats() {
    return await this.mediaService.getStats();
  }

  @ApiOperation({ summary: 'Get media files by type' })
  @ApiOkResponse({
    description: 'List of media files filtered by type',
    type: [Media],
  })
  @Public()
  @Get(':type')
  async findByType(@Param('type') type: MediaType, @Query() query: QueryDto) {
    return await this.mediaService.findByType(type, query);
  }

  @ApiOperation({ summary: 'Get media files by year and month' })
  @ApiOkResponse({
    description: 'List of media files for specific year and month',
    type: [Media],
  })
  @Public()
  @Get(':year/:month')
  async findByDate(
    @Param('year') year: string,
    @Param('month') month: string,
    @Query() query: QueryDto,
  ) {
    return await this.mediaService.findByDate(year, month, query);
  }

  @ApiOperation({ summary: 'Get a media file by ID' })
  @ApiOkResponse({ description: 'Media file details', type: Media })
  @ApiNotFoundResponse({ description: 'Media file not found' })
  @Public()
  @Get(':id')
  async findOne(@Param() { id }: IdDto): Promise<Media> {
    return await this.mediaService.findOne(id);
  }

  @ApiOperation({ summary: 'Update media metadata (Admin only)' })
  @ApiOkResponse({
    description: 'Media metadata updated successfully',
    type: Media,
  })
  @ApiNotFoundResponse({ description: 'Media file not found' })
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() dto: UpdateMediaDto,
  ): Promise<Media> {
    return await this.mediaService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a media file (Admin only)' })
  @ApiNoContentResponse({ description: 'Media file deleted successfully' })
  @ApiNotFoundResponse({ description: 'Media file not found' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param() { id }: IdDto): Promise<{ message: string }> {
    await this.mediaService.remove(id);
    return { message: 'Media file deleted successfully' };
  }

  @ApiOperation({ summary: 'Delete multiple media files (Admin only)' })
  @ApiBody(bulkDeleteSchema)
  @ApiNoContentResponse({ description: 'Media files deleted successfully' })
  @Roles(UserRole.ADMIN)
  @Delete('bulk/delete')
  async removeMultiple(
    @Body('ids') ids: string[],
  ): Promise<{ message: string }> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No media IDs provided');
    }

    await this.mediaService.removeMultiple(ids);
    return { message: `${ids.length} media file(s) deleted successfully` };
  }
}
