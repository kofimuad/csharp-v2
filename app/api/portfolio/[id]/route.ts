import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Project } from '@/lib/models';
import { deleteUploadsByIds, getRemovedUploadIds } from '@/lib/uploadCleanup';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const previous = await Project.findById(params.id).lean();
    if (!previous) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const project = await Project.findByIdAndUpdate(params.id, body, { new: true });
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const removedUploadIds = getRemovedUploadIds(previous, project.toObject());
    await deleteUploadsByIds(removedUploadIds);

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const removed = await Project.findByIdAndDelete(params.id).lean();
    if (removed) {
      const removedUploadIds = getRemovedUploadIds(removed, {});
      await deleteUploadsByIds(removedUploadIds);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
