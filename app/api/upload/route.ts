import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { put } from '@vercel/blob';
import { store } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string | null) || null;
    const caption = (formData.get('caption') as string | null) || null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form submission' }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          error:
            'BLOB_READ_WRITE_TOKEN is not configured in environment. To enable persistent media storage on Vercel Blob, configure the token in your deployment environment variables.',
        },
        { status: 503 }
      );
    }

    const blob = await put(file.name, file, {
      access: 'public',
      token,
    });

    // Persist in media asset library
    const asset = store.saveMediaAsset({
      url: blob.url,
      pathname: blob.pathname,
      filename: file.name,
      size: file.size,
      mimeType: blob.contentType || file.type || 'image/jpeg',
      altText,
      caption,
    });

    return NextResponse.json({
      success: true,
      asset,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Media upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
