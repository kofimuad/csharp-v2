import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import { ContactSubmission } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
