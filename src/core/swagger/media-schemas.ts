import { ApiBodyOptions } from '@nestjs/swagger';

export const singleFileUploadSchema: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
      alt_text: {
        type: 'string',
        description: 'Alternative text for the file',
      },
      description: {
        type: 'string',
        description: 'Description of the file',
      },
    },
    required: ['file'],
  },
};

export const multipleFilesUploadSchema: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
      alt_text: {
        type: 'string',
        description: 'Alternative text for the files',
      },
      description: {
        type: 'string',
        description: 'Description of the files',
      },
    },
    required: ['files'],
  },
};

export const bulkDeleteSchema: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      ids: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of media IDs to delete',
      },
    },
    required: ['ids'],
  },
};
