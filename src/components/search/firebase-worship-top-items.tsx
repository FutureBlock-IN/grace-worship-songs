"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

import type { FirebaseArticle } from "@/types/firebase-article";
import type { FirebaseCeremony } from "@/types/firebase-ceremony";
import type { FirebaseSong } from "@/types/firebase-song";

import { ProtectedContentLink } from "@/components/auth/protected-content-link";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { FirebaseArticleCard } from "@/components/worship/firebase-article-card";
import { FirebaseCeremonyCard } from "@/components/worship/firebase-ceremony-card";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { useEffectiveWorshipCollectionTab } from "@/hooks/use-effective-worship-collection-tab";
import { cn, getSongCoverUrl } from "@/lib/utils";

type WorshipTopItemsClientProps = {
  songs: FirebaseSong[];
  ceremonies: FirebaseCeremony[];
  articles: FirebaseArticle[];
};

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
          songs.map((song) => {
            const englishTitle = song.englishTitle ?? song.title ?? "";
            const teluguTitle = song.teluguTitle ?? "";
            const songHref = `/songs/${encodeURIComponent(song.id)}`;
            const coverUrl = getSongCoverUrl(song.imageUrl);

            return (
              <ProtectedContentLink
                key={song.id}
                href={songHref}
                className={cn(
                  "group relative flex w-full flex-shrink-0 items-center gap-3 overflow-hidden rounded-lg border border-border/50 bg-card/40 px-3 py-2.5 transition-all duration-200",
                  "hover:border-border/80 hover:bg-card/60 hover:shadow-sm"
                )}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                  <ImageWithFallback
                    src={coverUrl}
                    fallback={DEFAULT_SONG_COVER}
                    width={64}
                    height={64}
                    sizes="64px"
                    alt={englishTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                  <h3 className="line-clamp-2 text-sm font-bold leading-tight">
                    {englishTitle}
                  </h3>
                  {teluguTitle ? (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {teluguTitle}
                    </p>
                  ) : null}
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </ProtectedContentLink>
            );
          })}

        {activeTab === "ceremonies" &&
          ceremonies.map((ceremony) => (
            <FirebaseCeremonyCard key={ceremony.id} ceremony={ceremony} />
          ))}

        {activeTab === "articles" &&
          articles.map((article) => (
            <FirebaseArticleCard key={article.id} article={article} />
          ))}
      </div>
    </div>
  );
}
