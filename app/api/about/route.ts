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
    let about = await About.findOne();
    if (!about) {
      about = await About.create(body);
    } else {
      Object.assign(about, body);
      await about.save();
    }
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about' }, { status: 500 });
  }
}
