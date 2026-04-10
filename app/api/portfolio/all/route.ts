import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try { await connectDB(); const p = await Project.find().sort({ order: 1 }); return NextResponse.json(p); }
  catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
