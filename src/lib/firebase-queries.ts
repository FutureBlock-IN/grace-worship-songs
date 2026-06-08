"use server";

import { unstable_cache } from "next/cache";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { FieldValue } from "firebase-admin/firestore";

import type {
  CreateSongInput,
  FirebaseSong,
  UpdateSongInput,
} from "@/types/firebase-song";

import { getAdminDb, isAdminConfigured } from "./firebase-admin";
import { db } from "./firebase";

const SONGS_COLLECTION = "songs";

const PERMISSION_HELP =
  "Firebase permission denied. Publish firestore.rules and storage.rules in the Firebase Console (Firestore → Rules, Storage → Rules), or set FIREBASE_SERVICE_ACCOUNT_KEY in .env.";

function toMillis(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof (value as { toMillis: () => number }).toMillis === "function"
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (value instanceof Timestamp) {
    return value.toMillis();
  }
  if (typeof value === "number") {
    return value;
  }
  if (
    value &&
    typeof value === "object" &&
    "seconds" in value &&
    typeof (value as { seconds: number }).seconds === "number"
  ) {
    return (value as { seconds: number }).seconds * 1000;
  }
  return Date.now();
}

function normalizeSong(
  id: string,
  data: Record<string, unknown>
): FirebaseSong {
  const rawAudio = String(data.audioUrl ?? data.audioFileUrl ?? "").trim();
  const rawImage = String(data.imageUrl ?? data.coverImageUrl ?? "").trim();

  return {
    id,
    title: String(data.title ?? ""),
    lyrics: String(data.lyrics ?? data.teluguLyrics ?? ""),
    transliteratedLyrics: String(
      data.transliteratedLyrics ?? data.englishLyrics ?? ""
    ),
    imageUrl: rawImage || undefined,
    audioUrl: rawAudio || undefined,
    createdAt: toMillis(data.createdAt),
  };
}

function wrapFirebaseError(error: unknown): never {
  const message =
    error instanceof Error ? error.message : "Unknown Firebase error";

  if (message.includes("PERMISSION_DENIED") || message.includes("permission")) {
    throw new Error(PERMISSION_HELP);
  }

  throw error instanceof Error ? error : new Error(message);
}

async function fetchAllSongs(): Promise<FirebaseSong[]> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      const snapshot = await adminDb
        .collection(SONGS_COLLECTION)
        .orderBy("createdAt", "desc")
        .get();

      const songs = snapshot.docs.map((docSnap) =>
        normalizeSong(docSnap.id, docSnap.data() as Record<string, unknown>)
      );
      return songs;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    const q = query(
      collection(db, SONGS_COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const songs = snapshot.docs.map((docSnap) =>
      normalizeSong(docSnap.id, docSnap.data() as Record<string, unknown>)
    );
    return songs;
  } catch (error) {
    try {
      const snapshot = await getDocs(collection(db, SONGS_COLLECTION));
      const songs = snapshot.docs
        .map((docSnap) =>
          normalizeSong(docSnap.id, docSnap.data() as Record<string, unknown>)
        )
        .sort((a, b) => b.createdAt - a.createdAt);
      return songs;
    } catch (innerError) {
      wrapFirebaseError(innerError);
    }
  }
}

const getAllSongsCached = unstable_cache(
  async () => fetchAllSongs(),
  ["firebase:getAllSongs"],
  { revalidate: 60 }
);

export async function getAllSongs(): Promise<FirebaseSong[]> {
  return getAllSongsCached();
}

async function fetchSongById(songId: string): Promise<FirebaseSong | null> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      const snapshot = await adminDb
        .collection(SONGS_COLLECTION)
        .doc(songId)
        .get();

      if (!snapshot.exists) {
        return null;
      }

      const song = normalizeSong(
        snapshot.id,
        snapshot.data() as Record<string, unknown>
      );
      return song;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    const songRef = doc(db, SONGS_COLLECTION, songId);
    const snapshot = await getDoc(songRef);

    if (!snapshot.exists()) {
      return null;
    }

    const song = normalizeSong(
      snapshot.id,
      snapshot.data() as Record<string, unknown>
    );
    return song;
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function getSongById(songId: string): Promise<FirebaseSong | null> {
  const cached = unstable_cache(
    async () => fetchSongById(songId),
    ["firebase:getSongById", songId],
    { revalidate: 60 }
  );
  return cached();
}

export async function searchSongs(searchQuery: string): Promise<FirebaseSong[]> {
  const normalized = searchQuery.trim().toLowerCase();
  if (!normalized) return [];

  const songs = await getAllSongs();
  return songs.filter((song) => song.title.toLowerCase().includes(normalized));
}

export async function addSong(songData: CreateSongInput): Promise<string> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      console.log("[Firebase] Adding song (admin):", {
        title: songData.title,
      });
      const docRef = await adminDb.collection(SONGS_COLLECTION).add({
        ...songData,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log("[Firebase] Song added (admin):", docRef.id);
      return docRef.id;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    console.log("[Firebase] Adding song (client):", {
      title: songData.title,
    });
    const docRef = await addDoc(collection(db, SONGS_COLLECTION), {
      ...songData,
      createdAt: Timestamp.now(),
    });
    console.log("[Firebase] Song added (client):", docRef.id);
    return docRef.id;
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function updateSong(
  songId: string,
  updates: UpdateSongInput
): Promise<void> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      console.log("[Firebase] Updating song (admin):", {
        songId,
        updates: Object.keys(updates),
      });
      await adminDb.collection(SONGS_COLLECTION).doc(songId).update(updates);
      console.log("[Firebase] Song updated (admin):", songId);
      return;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    console.log("[Firebase] Updating song (client):", {
      songId,
      updates: Object.keys(updates),
    });
    const songRef = doc(db, SONGS_COLLECTION, songId);
    await updateDoc(songRef, updates);
    console.log("[Firebase] Song updated (client):", songId);
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function deleteSong(songId: string): Promise<void> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      console.log("[Firebase] Deleting song from Firestore:", songId);
      await adminDb.collection(SONGS_COLLECTION).doc(songId).delete();
      console.log("[Firebase] Song deleted successfully:", songId);
      return;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    console.log("[Firebase] Deleting song from Firestore (client):", songId);
    const songRef = doc(db, SONGS_COLLECTION, songId);
    await deleteDoc(songRef);
    console.log("[Firebase] Song deleted successfully (client):", songId);
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function isUsingFirebaseAdmin(): Promise<boolean> {
  return isAdminConfigured();
}
