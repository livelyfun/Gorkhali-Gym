import {
  BlobAccessError,
  BlobFileTooLargeError,
  BlobServiceNotAvailable,
  BlobStoreNotFoundError,
  BlobStoreSuspendedError,
} from '@vercel/blob';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const ALLOWED_UPLOAD_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const;

export type UploadErrorCode =
  | 'UPLOAD_MISSING_FILE'
  | 'UPLOAD_INVALID_TYPE'
  | 'UPLOAD_TOO_LARGE'
  | 'UPLOAD_NOT_CONFIGURED'
  | 'UPLOAD_STORAGE_UNAVAILABLE'
  | 'UPLOAD_FAILED';

export interface UploadFileLike {
  name: string;
  size: number;
  type: string;
}

export interface UploadValidationSuccess {
  ok: true;
  filename: string;
  pathname: string;
  mimeType: string;
  extension: string;
}

export interface UploadValidationFailure {
  ok: false;
  status: number;
  code: UploadErrorCode;
  message: string;
}

export type UploadValidationResult = UploadValidationSuccess | UploadValidationFailure;

export interface StorageErrorInfo {
  status: number;
  code: UploadErrorCode;
  message: string;
}

const MIME_TO_EXTENSIONS: Record<string, readonly string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/gif': ['gif'],
};

const INVALID_TYPE_MESSAGE =
  'Unsupported file type. Allowed formats are JPEG, PNG, WebP, and GIF.';
const TOO_LARGE_MESSAGE = 'File is too large. The maximum upload size is 10MB.';
const STORAGE_UNAVAILABLE_MESSAGE =
  'Media storage is not configured correctly. An administrator must connect the media storage store for this project.';
const STORAGE_NOT_CONFIGURED_MESSAGE =
  'Media storage is not configured. An administrator must set the BLOB_READ_WRITE_TOKEN environment variable for this deployment.';

function failure(status: number, code: UploadErrorCode, message: string): UploadValidationFailure {
  return { ok: false, status, code, message };
}

function extractExtension(name: string): string {
  const lastDot = name.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === name.length - 1) return '';
  return name
    .slice(lastDot + 1)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function sanitizeBaseName(name: string): string {
  const withoutExtension = (name || '').replace(/\.[^./\\]*$/, '');
  const leaf = withoutExtension.replace(/\\/g, '/').split('/').pop() ?? '';
  const sanitized = leaf
    .toLowerCase()
    .replace(/\.+/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return sanitized || 'image';
}

export function buildUploadPathname(
  fileName: string,
  extension: string,
  now: number = Date.now()
): string {
  const base = sanitizeBaseName(fileName);
  const ext = extension || 'jpg';
  return `media/${now}-${base}.${ext}`;
}

export function validateUploadFile(file: UploadFileLike | null | undefined): UploadValidationResult {
  if (!file || typeof file.name !== 'string' || !file.name.trim() || !(file.size > 0)) {
    return failure(400, 'UPLOAD_MISSING_FILE', 'No valid image file was provided.');
  }

  const mimeType = (file.type || '').trim().toLowerCase();
  const extension = extractExtension(file.name);
  const allowedExtensions = MIME_TO_EXTENSIONS[mimeType];

  if (!allowedExtensions) {
    return failure(400, 'UPLOAD_INVALID_TYPE', INVALID_TYPE_MESSAGE);
  }

  if (!extension || !allowedExtensions.includes(extension)) {
    return failure(400, 'UPLOAD_INVALID_TYPE', INVALID_TYPE_MESSAGE);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return failure(413, 'UPLOAD_TOO_LARGE', TOO_LARGE_MESSAGE);
  }

  return {
    ok: true,
    filename: `${sanitizeBaseName(file.name)}.${extension}`,
    pathname: buildUploadPathname(file.name, extension),
    mimeType,
    extension,
  };
}

export function storageNotConfigured(): StorageErrorInfo {
  return { status: 503, code: 'UPLOAD_NOT_CONFIGURED', message: STORAGE_NOT_CONFIGURED_MESSAGE };
}

export function classifyStorageError(err: unknown): StorageErrorInfo {
  if (err instanceof BlobStoreNotFoundError || err instanceof BlobStoreSuspendedError) {
    return { status: 503, code: 'UPLOAD_STORAGE_UNAVAILABLE', message: STORAGE_UNAVAILABLE_MESSAGE };
  }

  if (err instanceof BlobAccessError) {
    return {
      status: 503,
      code: 'UPLOAD_STORAGE_UNAVAILABLE',
      message:
        'Media storage rejected the upload. Verify the storage store access mode and token permissions.',
    };
  }

  if (err instanceof BlobServiceNotAvailable) {
    return {
      status: 503,
      code: 'UPLOAD_STORAGE_UNAVAILABLE',
      message: 'Media storage is temporarily unavailable. Please try again shortly.',
    };
  }

  if (err instanceof BlobFileTooLargeError) {
    return { status: 413, code: 'UPLOAD_TOO_LARGE', message: TOO_LARGE_MESSAGE };
  }

  return {
    status: 500,
    code: 'UPLOAD_FAILED',
    message: 'The upload could not be completed. Please try again.',
  };
}
