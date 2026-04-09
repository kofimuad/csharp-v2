import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Service } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    await connectDB();
    await seedDatabase();
    const services = await Service.find({ visible: true }).sort({ order: 1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
