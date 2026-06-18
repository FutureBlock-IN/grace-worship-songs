"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import type { FirebaseArticle } from "@/types/firebase-article";

import { FirebaseArticleCard } from "@/components/worship/firebase-article-card";
import { CollectionTabHeader } from "@/components/worship/collection-tab-header";
import { worshipContentGridClassName } from "@/components/worship/worship-card-styles";
import { TabEmptyState, TabLoadingState } from "@/components/worship/songs-tab-content";
import { db } from "@/lib/firebase";

type ArticlesTabContentProps = {
  initialArticles: FirebaseArticle[];
};

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return [];
}

function normalizeArticleData(
  id: string,
  data: Record<string, unknown>
): FirebaseArticle {
  const dateCreatedValue = data.dateCreated as unknown;
  const dateCreated =
    dateCreatedValue &&
    typeof dateCreatedValue === "object" &&
    typeof (dateCreatedValue as { toMillis(): number }).toMillis === "function"
      ? (dateCreatedValue as { toMillis(): number }).toMillis()
      : typeof dateCreatedValue === "number"
        ? dateCreatedValue
        : Date.now();

  return {
    id,
    title: String(data.title ?? ""),
    shortDescription: String(data.shortDescription ?? ""),
    content: String(data.content ?? ""),
    coverImage: String(data.coverImage ?? "").trim() || undefined,
    author: String(data.author ?? ""),
    tags: normalizeTags(data.tags),
    dateCreated,
    createdBy: String(data.createdBy ?? ""),
    isPublished: Boolean(data.isPublished),
  };
}

export function ArticlesTabContent({
  initialArticles,
}: ArticlesTabContentProps) {
  const [articles, setArticles] = useState<FirebaseArticle[]>(initialArticles);
  const [loading, setLoading] = useState(!initialArticles.length);

  useEffect(() => {
    const articlesQuery = query(
      collection(db, "articles"),
      orderBy("dateCreated", "desc")
    );

    const unsubscribe = onSnapshot(
      articlesQuery,
      (snapshot) => {
        const items = snapshot.docs
          .map((docSnap) =>
            normalizeArticleData(
              docSnap.id,
              docSnap.data() as Record<string, unknown>
            )
          )
          .filter((a) => a.isPublished);
        setArticles(items);
        setLoading(false);
      },
      (error) => {
        console.error("[ArticlesTabContent] Firestore snapshot failed:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <TabLoadingState label="Loading articles..." />;
  }

  if (articles.length === 0) {
    return <TabEmptyState message="No Articles Found" />;
  }

  return (
    <>
      <CollectionTabHeader title="Articles" count={articles.length} />
      <div className={worshipContentGridClassName}>
        {articles.map((article) => (
          <FirebaseArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}
