import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const author = (body.author || body.authorName || '').trim();
    const text = (body.text || body.content || '').trim();
    const role = (body.role || 'Member').trim();

    if (!author) {
      return NextResponse.json({ error: 'Please provide your name' }, { status: 400 });
    }

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: 'Review text must be at least 5 characters long' },
        { status: 400 }
      );
    }

    const numericRating = Math.min(5, Math.max(1, Number(body.rating) || 5));

    const review = store.saveReview({
      author: author,
      authorName: author,
      role: role,
      rating: numericRating,
      previewText: text.slice(0, 140),
      fullText: text,
      content: text,
      avatarUrl: null,
      reviewDate: new Date().toISOString(),
      isPublished: false, // Moderation safeguard
      publishedAt: null,
      displayOrder: 99,
    });
    await persistStore();

    return NextResponse.json({
      success: true,
      message:
        'Thank you! Your review has been submitted and will appear on the website once verified by Gorkhali Gym staff.',
      reviewId: review.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit review';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
