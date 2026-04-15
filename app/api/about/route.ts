import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import { About } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    await connectDB();
    await seedDatabase();
    const about = await About.findOne();
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    delete body._id;
    const about = await About.findOneAndUpdate({}, body, { new: true, upsert: true, setDefaultsOnInsert: true });
    return NextResponse.json(about);
  } catch (error) {
    console.error('About PUT failed:', error);
    return NextResponse.json({ error: 'Failed to update about' }, { status: 500 });
  }
}
