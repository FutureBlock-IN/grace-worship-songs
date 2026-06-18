import type { FirebaseSermon } from "@/types/firebase-sermon";

import { toMillis } from "./firebase-utils";

/** Current Firestore collection for sermons. */
export const SERMONS_COLLECTION = "sermons";

/**
 * Pre-refactor collection path. Documents may still live here until migrated.
 * Remove after all records are copied to {@link SERMONS_COLLECTION}.
 */
export const LEGACY_SERMONS_COLLECTION = "ceremonies";

export const SERMON_READ_COLLECTIONS = [
  SERMONS_COLLECTION,
  LEGACY_SERMONS_COLLECTION,
] as const;

export function normalizeSermonFromFirestore(
  id: string,
  data: Record<string, unknown>
): FirebaseSermon {
  const rawCover = String(data.coverImage ?? data.imageUrl ?? "").trim();

  return {
    id,
    title: String(data.title ?? ""),
    subtitle: String(data.subtitle ?? "").trim() || undefined,
    description: String(data.description ?? ""),
    coverImage: rawCover || undefined,
    category: String(data.category ?? "Other"),
    dateCreated: toMillis(data.dateCreated ?? data.createdAt),
    createdBy: String(data.createdBy ?? ""),
    isPublished: resolveIsPublished(data),
  };
}

/** Legacy docs without the field were visible before the publish flag existed. */
function resolveIsPublished(data: Record<string, unknown>): boolean {
  if (typeof data.isPublished === "boolean") return data.isPublished;
  return true;
}

export function mergeSermonsById(
  collections: FirebaseSermon[][]
): FirebaseSermon[] {
  const byId = new Map<string, FirebaseSermon>();

  for (const sermons of collections) {
    for (const sermon of sermons) {
      byId.set(sermon.id, sermon);
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => b.dateCreated - a.dateCreated
  );
}

export function logSermonFetchDebug(
  results: { collection: string; count: number; error?: unknown }[]
): void {
  if (process.env.NODE_ENV === "production") return;

  for (const { collection, count, error } of results) {
    if (error) {
      console.error(`[sermons] Firestore read failed`, { collection, error });
    } else {
      console.info(`[sermons] Firestore read ok`, { collection, count });
    }
  }
}
