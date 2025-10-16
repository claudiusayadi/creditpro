import { BadRequestException } from '@nestjs/common';
import bytes from 'bytes';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { basename, extname, join } from 'path';

import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } from './file.config';

// Export for backward compatibility
export const ALLOWED_EXTENSIONS = {
  images: [...ALLOWED_FILE_TYPES.images.extensions] as string[],
  documents: [...ALLOWED_FILE_TYPES.documents.extensions] as string[],
  pdfs: [...ALLOWED_FILE_TYPES.pdfs.extensions] as string[],
};

// Flatten all allowed extensions
export const ALL_ALLOWED_EXTENSIONS: string[] = [
  ...ALLOWED_FILE_TYPES.images.extensions,
  ...ALLOWED_FILE_TYPES.documents.extensions,
  ...ALLOWED_FILE_TYPES.pdfs.extensions,
];

// MIME type mappings
export const ALLOWED_MIME_TYPES: string[] = [
  ...ALLOWED_FILE_TYPES.images.mimeTypes,
  ...ALLOWED_FILE_TYPES.documents.mimeTypes,
  ...ALLOWED_FILE_TYPES.pdfs.mimeTypes,
];

// Max file size: 10MB
export const MAX_FILE_SIZE = FILE_SIZE_LIMITS.max;

/**
 * Sanitize filename: convert to lowercase, replace spaces and special chars with hyphens
 */
export const sanitizeFilename = (filename: string): string => {
  const nameWithoutExt = basename(filename, extname(filename));
  const ext = extname(filename);

  const sanitized = nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-') // replace spaces
    .replace(/[^a-z0-9-]/g, '-') // replace special chars
    .replace(/-+/g, '-') // replace multiple hyphens
    .replace(/^-|-$/g, ''); // remove leading/trailing hyphens

  return `${sanitized}${ext.toLowerCase()}`;
};

/**
 * Check if filename exists in directory and generate unique name with counter
 */
export const generateUniqueFilename = (
  directory: string,
  filename: string,
): string => {
  const sanitized = sanitizeFilename(filename);
  const nameWithoutExt = basename(sanitized, extname(sanitized));
  const ext = extname(sanitized);

  let uniqueFilename = sanitized;
  let counter = 1;

  // Check if file exists and increment counter until we find a unique name
  while (existsSync(join(directory, uniqueFilename))) {
    uniqueFilename = `${nameWithoutExt}-${counter}${ext}`;
    counter++;
  }

  return uniqueFilename;
};

/**
 * Generate upload destination path based on current date
 * Format: uploads/YYYY/MM
 */
export const getUploadDestination = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');

  const destination = `uploads/${year}/${month}`;

  // Create directory if it doesn't exist
  if (!existsSync(destination)) mkdirSync(destination, { recursive: true });

  return destination;
};

/**
 * Multer configuration for file uploads
 */
export const multerConfig = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      const destination = getUploadDestination();
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      // Get destination directory
      const destination = getUploadDestination();

      // Generate unique filename based on original name
      const uniqueFilename = generateUniqueFilename(
        destination,
        file.originalname,
      );

      cb(null, uniqueFilename);
    },
  }),
  fileFilter: (
    _req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const ext = extname(file.originalname).toLowerCase();

    // Check extension
    if (!ALL_ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(
        new BadRequestException(
          `File type not allowed. Allowed types: ${ALL_ALLOWED_EXTENSIONS.join(', ')}`,
        ),
        false,
      );
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new BadRequestException(`Invalid file MIME type: ${file.mimetype}`),
        false,
      );
    }

    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10, // Max 10 files per upload
    fields: 10, // Max 10 fields
  },
};

/**
 * Determine media type based on file extension
 */
export const getMediaType = (ext: string): string => {
  const extension = ext.toLowerCase();

  if (ALLOWED_FILE_TYPES.images.extensions.some((e) => e === extension)) {
    return 'image';
  }
  if (ALLOWED_FILE_TYPES.documents.extensions.some((e) => e === extension)) {
    return 'document';
  }
  if (ALLOWED_FILE_TYPES.pdfs.extensions.some((e) => e === extension)) {
    return 'pdf';
  }

  return 'unknown';
};

/**
 * Get human-readable file size
 * @param size - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (size: number): string => {
  return bytes(size) || `${size} bytes`;
};
