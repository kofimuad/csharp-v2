import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Service } from '@/lib/models';
export async function GET() {
  try { await connectDB(); const s = await Service.find().sort({ order: 1 }); return NextResponse.json(s); }
  catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
