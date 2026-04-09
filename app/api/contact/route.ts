import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ContactSubmission } from '@/lib/models';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, service, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    const submission = await ContactSubmission.create({ name, email, service, message });
    return NextResponse.json({ success: true, id: submission._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
