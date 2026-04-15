import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import { Testimonial } from '@/lib/models';
export async function GET() {
  try { await connectDB(); const t = await Testimonial.find(); return NextResponse.json(t); }
  catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
