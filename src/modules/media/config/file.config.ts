export const ALLOWED_FILE_TYPES = {
  // Images - Common web formats
  images: {
    extensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'],
    mimeTypes: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ],
    magicNumbers: {
      png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      jpeg: [0xff, 0xd8, 0xff],
      webp: [0x52, 0x49, 0x46, 0x46], // RIFF
      gif87a: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
      gif89a: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
    },
  },
  // Documents - Office formats
  documents: {
    extensions: ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.rtf'],
    mimeTypes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/rtf',
    ],
    magicNumbers: {
      doc: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], // OLE2
      docx: [0x50, 0x4b, 0x03, 0x04], // ZIP-based (DOCX, XLSX)
      rtf: [0x7b, 0x5c, 0x72, 0x74, 0x66], // {\rtf
    },
  },
  // PDF
  pdfs: {
    extensions: ['.pdf'],
    mimeTypes: ['application/pdf'],
    magicNumbers: {
      pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
    },
  },
} as const;

/* File size limits configuration */
export const FILE_SIZE_LIMITS = {
  max: 10 * 1024 * 1024, // 10MB
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  pdf: 10 * 1024 * 1024, // 10MB
} as const;
