import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ContactSubmission } from '@/lib/models';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const s = await ContactSubmission.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(s);
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await ContactSubmission.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
