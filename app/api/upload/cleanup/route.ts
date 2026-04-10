import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project, SiteSettings, Upload } from '@/lib/models';
import { collectUploadIds } from '@/lib/uploadCleanup';

// Scans site content and removes orphaned upload docs not referenced anymore.
export async function POST() {
  try {
    await connectDB();

    const [settings, projects] = await Promise.all([
      SiteSettings.findOne().lean(),
      Project.find({}).lean(),
    ]);

    const referencedIds = new Set<string>();
    collectUploadIds(settings, referencedIds);
    collectUploadIds(projects, referencedIds);

    const allUploads = await Upload.find({}, { _id: 1 }).lean();
    const orphanIds = allUploads
      .map((doc: any) => String(doc._id))
      .filter((id) => !referencedIds.has(id));

    let deleted = 0;
    if (orphanIds.length) {
      const result = await Upload.deleteMany({ _id: { $in: orphanIds } });
      deleted = result.deletedCount || 0;
    }

    return NextResponse.json({
      success: true,
      referenced: referencedIds.size,
      orphaned: orphanIds.length,
      deleted,
    });
  } catch (err) {
    console.error('Upload cleanup error:', err);
    return NextResponse.json({ error: 'Failed to cleanup uploads' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
