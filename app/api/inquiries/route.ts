import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data-store';
import { persistStore } from '@/lib/store-persistence';
import { requireAuth } from '@/lib/auth';
import { requireHydrated } from '@/lib/cms-request';

export async function POST(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  try {
    const { fullName, phone, email, goal, program, preferredTime, message, selectedOffer } = await req.json();

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: 'Please enter your full name' }, { status: 400 });
    }

    if (!phone || phone.trim().length < 7) {
      return NextResponse.json({ error: 'Please provide a valid contact phone or WhatsApp number' }, { status: 400 });
    }

    const inquiry = store.addInquiry({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      goal: goal || 'strength',
      program: program || undefined,
      preferredTime: preferredTime || 'morning',
      message: message?.trim() || null,
      selectedOffer: selectedOffer || null,
    });
    await persistStore();

    const settings = store.getSettings();
    const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
    const whatsAppMessage = encodeURIComponent(
      `Hello Gorkhali Gym! I applied online on your website (Ref: ${inquiry.referenceCode}). My goal is: ${inquiry.goal}. Please contact me.`
    );
    const whatsappRedirectUrl = `https://wa.me/${cleanPhone}?text=${whatsAppMessage}`;

    return NextResponse.json({
      success: true,
      message: 'Your application has been received! Our team will contact you shortly.',
      referenceCode: inquiry.referenceCode,
      inquiryId: inquiry.id,
      whatsappRedirectUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit application';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const inquiries = store.getInquiries();
  return NextResponse.json({ inquiries });
}

export async function PATCH(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id, status, adminNotes } = await req.json();
    if (!id) return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });

    const updated = store.updateInquiry(id, { status, adminNotes });
    await persistStore();
    if (!updated) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update inquiry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const notReady = await requireHydrated();
  if (notReady) return notReady;
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });

  const deleted = store.deleteInquiry(id);
  await persistStore();
  return NextResponse.json({ success: deleted });
}
