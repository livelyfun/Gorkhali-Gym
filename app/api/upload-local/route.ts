import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { validateUploadFile } from '@/lib/upload-validation';
import { requireHydrated } from '@/lib/cms-request';

// Development-only upload endpoint. Files written to public/uploads are NOT
// persistent on Vercel's serverless filesystem; production uploads must use
// /api/upload (Vercel Blob). This route returns 404 in production.
export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { error: 'No valid image file was provided.', code: 'UPLOAD_MISSING_FILE' },
        { status: 400 }
      );
    }
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

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${validation.filename}`;
    const bytes = await file.arrayBuffer();
    await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

    const publicUrl = `/uploads/${filename}`;

    const asset = store.saveMediaAsset({
      url: publicUrl,
      pathname: `/uploads/${filename}`,
      filename: validation.filename,
      size: file.size,
      mimeType: validation.mimeType,
      altText,
      caption,
    });
    await persistStore();

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      asset,
    });
  } catch (err: unknown) {
    console.error('[api/upload-local] local upload failed', err);
    return NextResponse.json(
      { error: 'The upload could not be completed. Please try again.', code: 'UPLOAD_FAILED' },
      { status: 500 }
    );
  }
}
