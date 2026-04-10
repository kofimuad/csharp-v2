import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Upload } from '@/lib/models';

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name?.replace(/[^a-zA-Z0-9.\-_]/g, '_') || `upload-${Date.now()}`;
      const doc = await Upload.create({
        filename: safeName,
        contentType: file.type || 'application/octet-stream',
        size: buffer.length,
        data: buffer,
      });
      urls.push(`/api/upload/${doc._id.toString()}`);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
