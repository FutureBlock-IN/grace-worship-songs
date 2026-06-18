"use server";

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
  CreateCeremonyInput,
  FirebaseCeremony,
  UpdateCeremonyInput,
} from "@/types/firebase-ceremony";

import { getAdminDb } from "./firebase-admin";
import { db } from "./firebase";
import { toMillis, wrapFirebaseError } from "./firebase-utils";

const CEREMONIES_COLLECTION = "ceremonies";

function normalizeCeremony(
  id: string,
  data: Record<string, unknown>
): FirebaseCeremony {
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
    isPublished: Boolean(data.isPublished),
  };
}

async function fetchAllCeremonies(): Promise<FirebaseCeremony[]> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      const snapshot = await adminDb
        .collection(CEREMONIES_COLLECTION)
        .orderBy("dateCreated", "desc")
        .get();

      return snapshot.docs.map((docSnap) =>
        normalizeCeremony(docSnap.id, docSnap.data() as Record<string, unknown>)
      );
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    const q = query(
      collection(db, CEREMONIES_COLLECTION),
      orderBy("dateCreated", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) =>
      normalizeCeremony(docSnap.id, docSnap.data() as Record<string, unknown>)
    );
  } catch (error) {
    try {
      const snapshot = await getDocs(collection(db, CEREMONIES_COLLECTION));
      return snapshot.docs
        .map((docSnap) =>
          normalizeCeremony(docSnap.id, docSnap.data() as Record<string, unknown>)
        )
        .sort((a, b) => b.dateCreated - a.dateCreated);
    } catch (innerError) {
      wrapFirebaseError(innerError);
    }
  }
}

export async function getCeremonies(): Promise<FirebaseCeremony[]> {
  return fetchAllCeremonies();
}

export async function getPublishedCeremonies(): Promise<FirebaseCeremony[]> {
  const ceremonies = await fetchAllCeremonies();
  return ceremonies.filter((c) => c.isPublished);
}

export async function getCeremonyById(
  ceremonyId: string
): Promise<FirebaseCeremony | null> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      const snapshot = await adminDb
        .collection(CEREMONIES_COLLECTION)
        .doc(ceremonyId)
        .get();

      if (!snapshot.exists) return null;

      return normalizeCeremony(
        snapshot.id,
        snapshot.data() as Record<string, unknown>
      );
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    const snapshot = await getDoc(doc(db, CEREMONIES_COLLECTION, ceremonyId));
    if (!snapshot.exists()) return null;

    return normalizeCeremony(
      snapshot.id,
      snapshot.data() as Record<string, unknown>
    );
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function searchCeremonies(
  searchQuery: string
): Promise<FirebaseCeremony[]> {
  const normalized = searchQuery.trim().toLowerCase();
  if (!normalized) return [];

  const ceremonies = await getPublishedCeremonies();
  return ceremonies.filter((ceremony) =>
    ceremony.title.toLowerCase().includes(normalized)
  );
}

export async function createCeremony(
  ceremonyData: CreateCeremonyInput
): Promise<string> {
  const adminDb = getAdminDb();
  const payload = {
    ...ceremonyData,
    dateCreated: FieldValue.serverTimestamp(),
  };

  if (adminDb) {
    try {
      const docRef = await adminDb.collection(CEREMONIES_COLLECTION).add(payload);
      return docRef.id;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    const docRef = await addDoc(collection(db, CEREMONIES_COLLECTION), {
      ...ceremonyData,
      dateCreated: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function updateCeremony(
  ceremonyId: string,
  updates: UpdateCeremonyInput
): Promise<void> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      await adminDb
        .collection(CEREMONIES_COLLECTION)
        .doc(ceremonyId)
        .update(updates);
      return;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    await updateDoc(doc(db, CEREMONIES_COLLECTION, ceremonyId), updates);
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function deleteCeremony(ceremonyId: string): Promise<void> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      await adminDb.collection(CEREMONIES_COLLECTION).doc(ceremonyId).delete();
      return;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    await deleteDoc(doc(db, CEREMONIES_COLLECTION, ceremonyId));
  } catch (error) {
    wrapFirebaseError(error);
  }
}
