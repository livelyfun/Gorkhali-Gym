import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { put } from '@vercel/blob';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import {
  classifyStorageError,
  storageNotConfigured,
  validateUploadFile,
} from '@/lib/upload-validation';

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const altText = (formData.get('altText') as string | null) || null;
    const caption = (formData.get('caption') as string | null) || null;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No valid image file was provided.', code: 'UPLOAD_MISSING_FILE' },
        { status: 400 }
      );
    }

    const validation = validateUploadFile(file);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.message, code: validation.code },
        { status: validation.status }
      );
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      const notConfigured = storageNotConfigured();
      console.error('[api/upload] BLOB_READ_WRITE_TOKEN is not configured');
      return NextResponse.json(
        { error: notConfigured.message, code: notConfigured.code },
        { status: notConfigured.status }
      );
    }

    const blob = await put(validation.pathname, file, {
      access: 'public',
      token,
      contentType: validation.mimeType,
    });

    const asset = store.saveMediaAsset({
      url: blob.url,
      pathname: blob.pathname,
      filename: validation.filename,
      size: file.size,
      mimeType: blob.contentType || validation.mimeType,
      altText,
      caption,
    });
    await persistStore();

    return NextResponse.json({
      success: true,
      asset,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (err: unknown) {
    console.error('[api/upload] media upload failed', err);
    const info = classifyStorageError(err);
    return NextResponse.json({ error: info.message, code: info.code }, { status: info.status });
  }
}
