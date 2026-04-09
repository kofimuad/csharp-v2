/**
 * Converts Mongoose documents (with ObjectId, Date, etc.)
 * into plain JSON-safe objects safe to pass to Client Components.
 */
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export function serializeArray<T>(docs: T[]): T[] {
  return JSON.parse(JSON.stringify(docs));
}
