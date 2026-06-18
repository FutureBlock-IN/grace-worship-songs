"use client";

import React from "react";

import type { FirebaseArticle } from "@/types/firebase-article";
import type { FirebaseCeremony } from "@/types/firebase-ceremony";
import type { FirebaseSong } from "@/types/firebase-song";

import { useEffectiveWorshipCollectionTab } from "@/hooks/use-effective-worship-collection-tab";

import { SearchResultRow } from "./search-result-row";

type WorshipTopItemsClientProps = {
  songs: FirebaseSong[];
  ceremonies: FirebaseCeremony[];
  articles: FirebaseArticle[];
};

function getCeremonySubtitle(ceremony: FirebaseCeremony): string | undefined {
  return ceremony.subtitle?.trim() || ceremony.description.trim() || undefined;
}

export function WorshipTopItemsClient({
  songs,
  ceremonies,
  articles,
}: WorshipTopItemsClientProps) {
  const { activeTab } = useEffectiveWorshipCollectionTab();

  const sectionLabel =
    activeTab === "songs"
      ? "Popular Songs"
      : activeTab === "ceremonies"
        ? "Recent Ceremonies"
        : "Recent Articles";

  const hasItems =
    activeTab === "songs"
      ? songs.length > 0
      : activeTab === "ceremonies"
        ? ceremonies.length > 0
        : articles.length > 0;

  if (!hasItems) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground">
        {activeTab === "songs"
          ? "No songs yet"
          : activeTab === "ceremonies"
            ? "No ceremonies yet"
            : "No articles yet"}
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 py-4">
      <p className="font-heading text-lg font-semibold">{sectionLabel}</p>
      <div className="flex max-h-96 w-full flex-col gap-2 overflow-y-auto pr-2">
        {activeTab === "songs" &&
          songs.map((song) => (
            <SearchResultRow
              key={song.id}
              href={`/songs/${encodeURIComponent(song.id)}`}
              title={song.englishTitle ?? song.title ?? ""}
              subtitle={song.teluguTitle}
              coverUrl={song.imageUrl}
            />
          ))}

        {activeTab === "ceremonies" &&
          ceremonies.map((ceremony) => (
            <SearchResultRow
              key={ceremony.id}
              href={`/ceremonies/${encodeURIComponent(ceremony.id)}`}
              title={ceremony.title}
              subtitle={getCeremonySubtitle(ceremony)}
              coverUrl={ceremony.coverImage}
            />
          ))}

        {activeTab === "articles" &&
          articles.map((article) => (
            <SearchResultRow
              key={article.id}
              href={`/articles/${encodeURIComponent(article.id)}`}
              title={article.title}
              subtitle={article.shortDescription}
              coverUrl={article.coverImage}
            />
          ))}
      </div>
    </div>
  );
}
