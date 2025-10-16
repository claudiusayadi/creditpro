import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { extname } from 'path';
import { Repository } from 'typeorm';

import { QueryDto } from 'src/core/common/dto/query.dto';
import type { IPaginatedResult } from 'src/core/common/interfaces/paginated-result.interface';
import { QB } from 'src/core/common/utils/query-builder.util';
import { getMediaType } from './config/multer.config';
import type { UpdateMediaDto } from './dto/update-media.dto';
import type { UploadFileDto } from './dto/upload-file.dto';
import { Media } from './entities/media.entity';
import { MediaType } from './interfaces/media.interface';
import { FileValidationService } from './validators/file-validation.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    private readonly configService: ConfigService,
    private readonly fileValidationService: FileValidationService,
  ) {}

  /**
   * Create media record after file upload
   */
  async create(file: Express.Multer.File, dto?: UploadFileDto): Promise<Media> {
    try {
      const baseUrl =
        this.configService.get<string>('APP_URL') || 'http://localhost:3000';
      const ext = extname(file.originalname);
      const mediaType = getMediaType(ext);

      // Extract year and month from file path
      const pathParts = file.path.split('/');
      const year = pathParts[pathParts.length - 3];
      const month = pathParts[pathParts.length - 2];

      const media = this.mediaRepo.create({
        filename: file.filename,
        original_filename: file.originalname,
        file_path: file.path,
        url: `${baseUrl}/${file.path}`,
        mime_type: file.mimetype,
        size: file.size,
        type: mediaType as MediaType,
        extension: ext,
        year,
        month,
        alt_text: dto?.alt_text,
        description: dto?.description,
      });

      return await this.mediaRepo.save(media);
    } catch {
      // If database save fails, delete the uploaded file
      if (existsSync(file.path)) {
        await unlink(file.path).catch(() => {});
      }
      throw new InternalServerErrorException('Failed to save media record');
    }
  }

  /**
   * Upload multiple files
   */
  async createMultiple(
    files: Express.Multer.File[],
    dto?: UploadFileDto,
  ): Promise<Media[]> {
    const uploadedMedia: Media[] = [];

    for (const file of files) {
      const media = await this.create(file, dto);
      uploadedMedia.push(media);
    }

    return uploadedMedia;
  }

  /**
   * Get all media with pagination and filtering
   */
  async findAll(query: QueryDto): Promise<IPaginatedResult<Media>> {
    return await QB.paginate(this.mediaRepo, query, {
      defaultSearchFields: ['original_filename', 'alt_text', 'description'],
    });
  }

  /**
   * Get media by type
   */
  async findByType(
    type: MediaType,
    query: QueryDto,
  ): Promise<IPaginatedResult<Media>> {
    return await QB.paginate(this.mediaRepo, query, {
      defaultSearchFields: ['original_filename', 'alt_text', 'description'],
      additionalWhere: { type },
    });
  }

  /**
   * Get media by year and month
   */
  async findByDate(
    year: string,
    month: string,
    query: QueryDto,
  ): Promise<IPaginatedResult<Media>> {
    return await QB.paginate(this.mediaRepo, query, {
      defaultSearchFields: ['original_filename', 'alt_text', 'description'],
      additionalWhere: { year, month },
    });
  }

  /**
   * Get single media by ID
   */
  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepo.findOne({ where: { id } });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  /**
   * Update media metadata
   */
  async update(id: string, dto: UpdateMediaDto): Promise<Media> {
    const media = await this.findOne(id);

    const updatedMedia = await this.mediaRepo.preload({
      id: media.id,
      ...dto,
    });

    if (!updatedMedia) {
      throw new NotFoundException('Media not found');
    }

    return await this.mediaRepo.save(updatedMedia);
  }

  /**
   * Delete media file and record
   */
  async remove(id: string): Promise<void> {
    const media = await this.findOne(id);

    // Delete physical file
    if (existsSync(media.file_path)) {
      try {
        await unlink(media.file_path);
      } catch (error) {
        // Log error but continue with database deletion
        console.error(`Failed to delete file: ${media.file_path}`, error);
      }
    }

    // Soft delete from database
    await this.mediaRepo.softDelete(media.id);
  }

  /**
   * Delete multiple media files
   */
  async removeMultiple(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.remove(id);
    }
  }

  /**
   * Get media statistics
   */
  async getStats(): Promise<{
    total: number;
    images: number;
    documents: number;
    pdfs: number;
    totalSize: number;
  }> {
    const [total, images, documents, pdfs] = await Promise.all([
      this.mediaRepo.count(),
      this.mediaRepo.count({ where: { type: MediaType.IMAGE } }),
      this.mediaRepo.count({ where: { type: MediaType.DOCUMENT } }),
      this.mediaRepo.count({ where: { type: MediaType.PDF } }),
    ]);

    // Calculate total size
    const result = await this.mediaRepo
      .createQueryBuilder('media')
      .select('SUM(media.size)', 'totalSize')
      .getRawOne<{ totalSize: string }>();

    const totalSize = parseInt(result?.totalSize ?? '0', 10);

    return {
      total,
      images,
      documents,
      pdfs,
      totalSize,
    };
  }
}
