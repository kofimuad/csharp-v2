import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteSettings } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';
import { deleteUploadsByIds, getRemovedUploadIds } from '@/lib/uploadCleanup';

export async function GET() {
  try {
    await connectDB();
    await seedDatabase();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const prevSettings = await SiteSettings.findOne().lean();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();

      const removedUploadIds = getRemovedUploadIds(prevSettings, settings.toObject());
      await deleteUploadsByIds(removedUploadIds);
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
