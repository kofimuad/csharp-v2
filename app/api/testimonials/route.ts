import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Testimonial } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    await connectDB();
    await seedDatabase();
    const testimonials = await Testimonial.find({ visible: true });
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const testimonial = await Testimonial.create(body);
    return NextResponse.json(testimonial, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
