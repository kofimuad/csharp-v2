import { isValidObjectId } from 'mongoose';
import { Upload } from '@/lib/models';

const UPLOAD_URL_REGEX = /\/api\/upload\/([a-fA-F0-9]{24})(?:[/?#]|$)/;

export function extractUploadIdFromUrl(url: string): string | null {
  const match = url.match(UPLOAD_URL_REGEX);
  return match?.[1] || null;
}

export function collectUploadIds(value: unknown, into: Set<string> = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    const id = extractUploadIdFromUrl(value);
    if (id) into.add(id);
    return into;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectUploadIds(item, into);
    return into;
  }

  if (value && typeof value === 'object') {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      collectUploadIds(nested, into);
    }
  }

  return into;
}

export function getRemovedUploadIds(before: unknown, after: unknown): string[] {
  const beforeIds = collectUploadIds(before);
  const afterIds = collectUploadIds(after);
  return Array.from(beforeIds).filter((id) => !afterIds.has(id));
}

export async function deleteUploadsByIds(ids: string[]): Promise<number> {
  const collected = ids.filter((id) => isValidObjectId(id));
  const validIds = Array.from(new Set(collected));
  if (!validIds.length) return 0;

  const result = await Upload.deleteMany({ _id: { $in: validIds } });
  return result.deletedCount || 0;
}
