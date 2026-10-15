import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BlobAccessError,
  BlobFileTooLargeError,
  BlobServiceNotAvailable,
  BlobStoreNotFoundError,
  BlobStoreSuspendedError,
} from '@vercel/blob';
import {
  MAX_UPLOAD_BYTES,
  buildUploadPathname,
  classifyStorageError,
  sanitizeBaseName,
  storageNotConfigured,
  validateUploadFile,
} from '../lib/upload-validation.ts';

// Note: authentication on /api/upload is enforced by requireAuth(req) and is
// intentionally unchanged. Plain Node cannot resolve the Next.js route/auth
// dependencies in this repository, so the 401 path is verified manually against
// a running server instead of with fragile module mocks:
//
//   curl -i -X POST https://gorkhali-gym.vercel.app/api/upload   # expect 401
//   curl -i -X POST http://localhost:3000/api/upload             # expect 401
//
// Then log in through the CMS and confirm uploads return 200 only when authenticated.

const SAFE_PATHNAME = /^media\/\d+-[a-z0-9-]+\.[a-z0-9]+$/;

test('accepts valid image types', () => {
  const cases = [
    { name: 'photo.jpg', type: 'image/jpeg' },
    { name: 'photo.jpeg', type: 'image/jpeg' },
    { name: 'graphic.png', type: 'image/png' },
    { name: 'shot.webp', type: 'image/webp' },
    { name: 'loop.gif', type: 'image/gif' },
  ];

  for (const c of cases) {
    const result = validateUploadFile({ ...c, size: 1024 });
    assert.equal(result.ok, true, `${c.name} should be accepted`);
    if (result.ok) {
      assert.match(result.pathname, SAFE_PATHNAME);
      assert.equal(result.mimeType, c.type);
      assert.ok(result.filename.endsWith(`.${result.extension}`));
    }
  }
});

test('rejects missing, empty and zero-size files', () => {
  for (const input of [null, undefined, { name: '', size: 10, type: 'image/png' }, { name: 'a.png', size: 0, type: 'image/png' }]) {
    const result = validateUploadFile(input as never);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, 'UPLOAD_MISSING_FILE');
      assert.equal(result.status, 400);
    }
  }
});

test('rejects SVG and other unsupported formats', () => {
  const cases = [
    { name: 'vector.svg', type: 'image/svg+xml' },
    { name: 'doc.pdf', type: 'application/pdf' },
    { name: 'page.html', type: 'text/html' },
    { name: 'shell.sh', type: 'application/x-sh' },
  ];

  for (const c of cases) {
    const result = validateUploadFile({ ...c, size: 2048 });
    assert.equal(result.ok, false, `${c.name} should be rejected`);
    if (!result.ok) {
      assert.equal(result.code, 'UPLOAD_INVALID_TYPE');
      assert.equal(result.status, 400);
    }
  }
});

test('rejects MIME/extension mismatches', () => {
  const cases = [
    { name: 'payload.exe', type: 'image/png' },
    { name: 'photo.png', type: 'image/gif' },
    { name: 'photo.gif', type: 'image/jpeg' },
    { name: 'noextension', type: 'image/png' },
  ];

  for (const c of cases) {
    const result = validateUploadFile({ ...c, size: 2048 });
    assert.equal(result.ok, false, `${c.name} should be rejected`);
    if (!result.ok) assert.equal(result.code, 'UPLOAD_INVALID_TYPE');
  }
});

test('enforces the 10MB size limit', () => {
  const atLimit = validateUploadFile({ name: 'ok.jpg', type: 'image/jpeg', size: MAX_UPLOAD_BYTES });
  assert.equal(atLimit.ok, true);

  const overLimit = validateUploadFile({ name: 'big.jpg', type: 'image/jpeg', size: MAX_UPLOAD_BYTES + 1 });
  assert.equal(overLimit.ok, false);
  if (!overLimit.ok) {
    assert.equal(overLimit.code, 'UPLOAD_TOO_LARGE');
    assert.equal(overLimit.status, 413);
  }
});

test('sanitizes path traversal and unsafe filenames', () => {
  const result = validateUploadFile({ name: '../../etc/passwd.png', type: 'image/png', size: 512 });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.doesNotMatch(result.pathname, /\.\./);
    assert.equal(result.pathname.split('/').length, 2);
    assert.ok(result.pathname.startsWith('media/'));
    assert.match(result.pathname, SAFE_PATHNAME);
  }

  assert.equal(sanitizeBaseName('../../etc/passwd'), 'passwd');
  assert.equal(sanitizeBaseName('...'), 'image');
  assert.equal(sanitizeBaseName('   '), 'image');
});

test('handles Unicode filenames safely', () => {
  const result = validateUploadFile({ name: 'स्क्वाट फोटो.png', type: 'image/png', size: 512 });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.match(result.pathname, SAFE_PATHNAME);
    assert.doesNotMatch(result.pathname, /[^\x00-\x7F]/);
  }

  const emoji = validateUploadFile({ name: '🏋️‍♂️.jpg', type: 'image/jpeg', size: 512 });
  assert.equal(emoji.ok, true);
  if (emoji.ok) assert.match(emoji.pathname, SAFE_PATHNAME);
});

test('buildUploadPathname produces deterministic safe paths', () => {
  const pathname = buildUploadPathname('My Photo (1).JPEG', 'jpeg', 1700000000000);
  assert.equal(pathname, 'media/1700000000000-my-photo-1.jpeg');
});

test('classifies Vercel Blob storage errors', () => {
  assert.deepEqual(classifyStorageError(new BlobStoreNotFoundError()), {
    status: 503,
    code: 'UPLOAD_STORAGE_UNAVAILABLE',
    message: 'Media storage is not configured correctly. An administrator must connect the media storage store for this project.',
  });
  assert.equal(classifyStorageError(new BlobStoreSuspendedError()).status, 503);
  assert.equal(classifyStorageError(new BlobAccessError()).status, 503);
  assert.equal(classifyStorageError(new BlobServiceNotAvailable()).status, 503);

  const tooLarge = classifyStorageError(new BlobFileTooLargeError('5GB'));
  assert.equal(tooLarge.status, 413);
  assert.equal(tooLarge.code, 'UPLOAD_TOO_LARGE');

  const unknown = classifyStorageError(new Error('boom: internal stack detail'));
  assert.equal(unknown.status, 500);
  assert.equal(unknown.code, 'UPLOAD_FAILED');
});

test('storageNotConfigured reports a safe 503', () => {
  const info = storageNotConfigured();
  assert.equal(info.status, 503);
  assert.equal(info.code, 'UPLOAD_NOT_CONFIGURED');
});

test('client-facing messages never leak secrets or raw exceptions', () => {
  const messages: string[] = [
    storageNotConfigured().message,
    classifyStorageError(new BlobStoreNotFoundError()).message,
    classifyStorageError(new BlobAccessError()).message,
    classifyStorageError(new BlobServiceNotAvailable()).message,
    classifyStorageError(new BlobFileTooLargeError('huge')).message,
    classifyStorageError(new Error('secret token vercel_blob_rw_abc123 at /app/route.ts')).message,
  ];

  const invalid = validateUploadFile({ name: 'x.pdf', type: 'application/pdf', size: 10 });
  const tooLarge = validateUploadFile({ name: 'x.jpg', type: 'image/jpeg', size: MAX_UPLOAD_BYTES + 1 });
  if (!invalid.ok) messages.push(invalid.message);
  if (!tooLarge.ok) messages.push(tooLarge.message);

  for (const message of messages) {
    assert.doesNotMatch(message, /vercel_blob_rw/i);
    assert.doesNotMatch(message, /secret/i);
    assert.doesNotMatch(message, /\bat \//);
    assert.doesNotMatch(message, /stack/i);
  }
});
