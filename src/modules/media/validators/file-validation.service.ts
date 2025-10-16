import { BadRequestException, Injectable } from '@nestjs/common';
import bytes from 'bytes';
import { fileTypeFromBuffer } from 'file-type';
import { filetypemime } from 'magic-bytes.js';
import { lookup } from 'mime-types';
import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } from '../config/file.config';

/**
 * File validation service implementing multi-layered security checks
 * Based on OWASP File Upload Security recommendations
 *
 * Validation layers:
 * 1. File extension whitelist
 * 2. MIME type
 * 3. Magic number - file signature/header check
 * 4. File size validation (prevent DoS attacks)
 *
 * @see https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload
 * @see https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
 */
@Injectable()
export class FileValidationService {
  /**
   * Get all allowed extensions across all file types
   */
  getAllowedExtensions(): string[] {
    return [
      ...ALLOWED_FILE_TYPES.images.extensions,
      ...ALLOWED_FILE_TYPES.documents.extensions,
      ...ALLOWED_FILE_TYPES.pdfs.extensions,
    ];
  }

  getAllowedMimeTypes(): string[] {
    return [
      ...ALLOWED_FILE_TYPES.images.mimeTypes,
      ...ALLOWED_FILE_TYPES.documents.mimeTypes,
      ...ALLOWED_FILE_TYPES.pdfs.mimeTypes,
    ];
  }

  /**
   * Validate file extension against whitelist
   * @param filename - Original filename
   * @returns Extension if valid
   * @throws BadRequestException if extension not allowed
   */
  validateExtension(filename: string): string {
    const ext = this.extractExtension(filename);
    const allowedExtensions = this.getAllowedExtensions();

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `File extension '${ext}' not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
      );
    }

    return ext;
  }

  /**
   * Validate MIME type to prevent simple MIME type spoofing
   * @param filename - Original filename
   * @param providedMimeType - MIME type from client
   * @returns Validated MIME type
   * @throws BadRequestException if MIME type invalid
   */
  validateMimeType(filename: string, providedMimeType: string): string {
    const expectedMimeType = lookup(filename);

    if (!expectedMimeType) {
      throw new BadRequestException(
        `Unable to determine MIME type for file: ${filename}`,
      );
    }

    if (providedMimeType !== expectedMimeType) {
      // Allow for common variations (e.g., image/jpg vs image/jpeg) - very important
      const allowedMimeTypes = this.getAllowedMimeTypes();
      if (!allowedMimeTypes.includes(providedMimeType)) {
        throw new BadRequestException(
          `MIME type mismatch. Expected '${expectedMimeType}' but got '${providedMimeType}'`,
        );
      }
    }

    // Verify MIME type is in whitelist
    const allowedMimeTypes = this.getAllowedMimeTypes();
    if (!allowedMimeTypes.includes(providedMimeType)) {
      throw new BadRequestException(
        `MIME type '${providedMimeType}' not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    return providedMimeType;
  }

  /**
   * Validate file signature (magic numbers) to prevent file type tampering
   * Uses both file-type and magic-bytes.js for comprehensive validation
   * Checks the actual file content, not just metadata that can be easily spoofed
   * @param buffer - File buffer
   * @param filename - Original filename
   * @returns Promise<boolean>
   * @throws BadRequestException if signature validation fails
   */
  async validateFileSignature(
    buffer: Buffer,
    filename: string,
  ): Promise<boolean> {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('File buffer is empty');
    }

    const ext = this.extractExtension(filename);

    // Special cases
    if (ext === '.txt') return true;
    if (ext === '.svg') return this.validateSVG(buffer);

    try {
      // Primary validation using file-type package
      const detectedType = await fileTypeFromBuffer(buffer);

      if (!detectedType) {
        // Fallback to magic-bytes.js for additional detection
        const magicBytesResult = filetypemime(new Uint8Array(buffer));

        if (!magicBytesResult || magicBytesResult.length === 0) {
          throw new BadRequestException(
            `Unable to detect file type from content. File may be corrupted or not a valid ${ext} file`,
          );
        }

        // detected type == expected extension
        const allowedMimeTypes = this.getAllowedMimeTypes();
        const isValid = magicBytesResult.some((mime) =>
          allowedMimeTypes.includes(mime),
        );

        if (!isValid) {
          throw new BadRequestException(
            `File signature does not match expected type for ${ext}. Detected: ${magicBytesResult.join(', ')}`,
          );
        }

        return true;
      }

      // detected MIME type == allowed
      const allowedMimeTypes = this.getAllowedMimeTypes();
      if (!allowedMimeTypes.includes(detectedType.mime)) {
        throw new BadRequestException(
          `File signature indicates type '${detectedType.mime}' which is not allowed`,
        );
      }

      // Verify extension matches detected type
      const expectedExt = `.${detectedType.ext}`;
      const extVariations = this.getExtensionVariations(ext);

      if (!extVariations.includes(expectedExt)) {
        throw new BadRequestException(
          `File extension '${ext}' does not match file content (detected: ${expectedExt}). Possible file tampering detected.`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `File signature validation failed: ${errorMessage}`,
      );
    }
  }

  /**
   * Validate file size with category-specific limits
   * @param size - File size in bytes
   * @param fileCategory - Category of file (image, document, pdf)
   * @returns Human-readable size string
   * @throws BadRequestException if size exceeds limits
   */
  validateFileSize(size: number, fileCategory: string): string {
    let maxSize: number = FILE_SIZE_LIMITS.max;

    const categoryLimit = FILE_SIZE_LIMITS[
      fileCategory as keyof typeof FILE_SIZE_LIMITS
    ] as number | undefined;

    if (categoryLimit) {
      maxSize = categoryLimit;
    }

    if (size > maxSize) {
      const humanSize = bytes(size) || `${size} bytes`;
      const humanMaxSize = bytes(maxSize) || `${maxSize} bytes`;
      throw new BadRequestException(
        `File size ${humanSize} exceeds maximum allowed size of ${humanMaxSize} for ${fileCategory} files`,
      );
    }

    if (size === 0) {
      throw new BadRequestException('File is empty (0 bytes)');
    }

    return bytes(size) || `${size} bytes`;
  }

  /**
   * Comprehensive file validation - performs all security checks
   * @param file - Express Multer File object
   * @returns Promise<ValidationResult>
   * @throws BadRequestException if any validation fails
   */
  async validateFile(file: Express.Multer.File): Promise<{
    isValid: boolean;
    extension: string;
    mimeType: string;
    size: string;
    category: string;
  }> {
    const extension = this.validateExtension(file.originalname);
    const mimeType = this.validateMimeType(file.originalname, file.mimetype);
    const category = this.getFileCategory(extension);
    const size = this.validateFileSize(file.size, category);

    if (file.buffer) {
      await this.validateFileSignature(file.buffer, file.originalname);
    }

    return {
      isValid: true,
      extension,
      mimeType,
      size,
      category,
    };
  }

  private extractExtension(filename: string): string {
    const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!ext) {
      throw new BadRequestException('File must have an extension');
    }
    return ext;
  }

  private getFileCategory(extension: string): string {
    const allowedExtensions = this.getAllowedExtensions();

    if (!allowedExtensions.includes(extension)) {
      return 'unknown';
    }

    switch (true) {
      case ALLOWED_FILE_TYPES.images.extensions.includes(
        extension as (typeof ALLOWED_FILE_TYPES.images.extensions)[number],
      ):
        return 'image';
      case ALLOWED_FILE_TYPES.documents.extensions.includes(
        extension as (typeof ALLOWED_FILE_TYPES.documents.extensions)[number],
      ):
        return 'document';
      case ALLOWED_FILE_TYPES.pdfs.extensions.includes(
        extension as (typeof ALLOWED_FILE_TYPES.pdfs.extensions)[number],
      ):
        return 'pdf';
      default:
        return 'unknown';
    }
  }

  private getExtensionVariations(ext: string): string[] {
    const variations: Record<string, string[]> = {
      '.jpg': ['.jpg', '.jpeg'],
      '.jpeg': ['.jpg', '.jpeg'],
    };
    return variations[ext] ?? [ext];
  }

  private validateSVG(buffer: Buffer): boolean {
    const content = buffer.toString('utf-8', 0, Math.min(1000, buffer.length));

    // Check for SVG opening tag
    if (!content.includes('<svg') && !content.includes('<?xml')) {
      throw new BadRequestException(
        'Invalid SVG file: Missing SVG or XML declaration',
      );
    }

    // Basic security check: reject SVG with script tags
    if (content.toLowerCase().includes('<script')) {
      throw new BadRequestException(
        'SVG file contains script tags and is not allowed for security reasons',
      );
    }

    return true;
  }

  /**
   * Format file size to human-readable string
   * @param size - Size in bytes
   * @returns Human-readable size string
   */
  formatFileSize(size: number): string {
    return bytes(size) ?? `${size} bytes`;
  }
}
