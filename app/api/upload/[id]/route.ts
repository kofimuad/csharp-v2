import { NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Upload } from '@/lib/models';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid upload id' }, { status: 400 });
    }

    const upload = await Upload.findById(id).lean();
    if (!upload?.data) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const data = upload.data instanceof Buffer
      ? upload.data
      : Buffer.from((upload.data as any).buffer || upload.data);

    return new NextResponse(data, {
      headers: {
        'Content-Type': upload.contentType || 'application/octet-stream',
        'Content-Length': String(upload.size || data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${upload.filename || 'file'}"`,
      },
    });
  } catch (err) {
    console.error('Upload read error:', err);
    return NextResponse.json({ error: 'Failed to read upload' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
