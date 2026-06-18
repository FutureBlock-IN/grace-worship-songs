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
  CreateArticleInput,
  FirebaseArticle,
  UpdateArticleInput,
} from "@/types/firebase-article";

import { getAdminDb } from "./firebase-admin";
import { db } from "./firebase";
import { toMillis, wrapFirebaseError } from "./firebase-utils";

const ARTICLES_COLLECTION = "articles";

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeArticle(
  id: string,
  data: Record<string, unknown>
): FirebaseArticle {
  const rawCover = String(data.coverImage ?? data.imageUrl ?? "").trim();

  return {
    id,
    title: String(data.title ?? ""),
    shortDescription: String(data.shortDescription ?? ""),
    content: String(data.content ?? ""),
    coverImage: rawCover || undefined,
    author: String(data.author ?? ""),
    tags: normalizeTags(data.tags),
    dateCreated: toMillis(data.dateCreated ?? data.createdAt),
    createdBy: String(data.createdBy ?? ""),
    isPublished: Boolean(data.isPublished),
  };
}

async function fetchAllArticles(): Promise<FirebaseArticle[]> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      const snapshot = await adminDb
        .collection(ARTICLES_COLLECTION)
        .orderBy("dateCreated", "desc")
        .get();

      return snapshot.docs.map((docSnap) =>
        normalizeArticle(docSnap.id, docSnap.data() as Record<string, unknown>)
      );
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      orderBy("dateCreated", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) =>
      normalizeArticle(docSnap.id, docSnap.data() as Record<string, unknown>)
    );
  } catch (error) {
    try {
      const snapshot = await getDocs(collection(db, ARTICLES_COLLECTION));
      return snapshot.docs
        .map((docSnap) =>
          normalizeArticle(docSnap.id, docSnap.data() as Record<string, unknown>)
        )
        .sort((a, b) => b.dateCreated - a.dateCreated);
    } catch (innerError) {
      wrapFirebaseError(innerError);
    }
  }
}

export async function getArticles(): Promise<FirebaseArticle[]> {
  return fetchAllArticles();
}

export async function getPublishedArticles(): Promise<FirebaseArticle[]> {
  const articles = await fetchAllArticles();
  return articles.filter((a) => a.isPublished);
}

export async function getArticleById(
  articleId: string
): Promise<FirebaseArticle | null> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      const snapshot = await adminDb
        .collection(ARTICLES_COLLECTION)
        .doc(articleId)
        .get();

      if (!snapshot.exists) return null;

      return normalizeArticle(
        snapshot.id,
        snapshot.data() as Record<string, unknown>
      );
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    const snapshot = await getDoc(doc(db, ARTICLES_COLLECTION, articleId));
    if (!snapshot.exists()) return null;

    return normalizeArticle(
      snapshot.id,
      snapshot.data() as Record<string, unknown>
    );
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function searchArticles(
  searchQuery: string
): Promise<FirebaseArticle[]> {
  const normalized = searchQuery.trim().toLowerCase();
  if (!normalized) return [];

  const articles = await getPublishedArticles();
  return articles.filter((article) => {
    const inTitle = article.title.toLowerCase().includes(normalized);
    const inTags = article.tags.some((tag) =>
      tag.toLowerCase().includes(normalized)
    );
    return inTitle || inTags;
  });
}

export async function createArticle(
  articleData: CreateArticleInput
): Promise<string> {
  const adminDb = getAdminDb();
  const payload = {
    ...articleData,
    dateCreated: FieldValue.serverTimestamp(),
  };

  if (adminDb) {
    try {
      const docRef = await adminDb.collection(ARTICLES_COLLECTION).add(payload);
      return docRef.id;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
      ...articleData,
      dateCreated: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function updateArticle(
  articleId: string,
  updates: UpdateArticleInput
): Promise<void> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      await adminDb.collection(ARTICLES_COLLECTION).doc(articleId).update(updates);
      return;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    await updateDoc(doc(db, ARTICLES_COLLECTION, articleId), updates);
  } catch (error) {
    wrapFirebaseError(error);
  }
}

export async function deleteArticle(articleId: string): Promise<void> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      await adminDb.collection(ARTICLES_COLLECTION).doc(articleId).delete();
      return;
    } catch (error) {
      wrapFirebaseError(error);
    }
  }

  try {
    await deleteDoc(doc(db, ARTICLES_COLLECTION, articleId));
  } catch (error) {
    wrapFirebaseError(error);
  }
}
