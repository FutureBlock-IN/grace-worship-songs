"use client";

import React from "react";
import { Loader2, ChevronRight } from "lucide-react";

import type { FirebaseArticle } from "@/types/firebase-article";
import type { FirebaseCeremony } from "@/types/firebase-ceremony";
import type { FirebaseSong } from "@/types/firebase-song";

import { ImageWithFallback } from "@/components/image-with-fallback";
import { ProtectedContentLink } from "@/components/auth/protected-content-link";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { useEffectiveWorshipCollectionTab } from "@/hooks/use-effective-worship-collection-tab";
import { getContentTypeLabel } from "@/lib/worship-collection";
import { searchArticles } from "@/lib/firebase-article-queries";
import { searchCeremonies } from "@/lib/firebase-ceremony-queries";
import { searchSongs } from "@/lib/firebase-queries";
import { cn, getSongCoverUrl } from "@/lib/utils";

type FirebaseWorshipSearchProps = {
  query: string;
};

export function FirebaseWorshipSearch({ query }: FirebaseWorshipSearchProps) {
  const { activeTab } = useEffectiveWorshipCollectionTab();
  const [songs, setSongs] = React.useState<FirebaseSong[]>([]);
  const [ceremonies, setCeremonies] = React.useState<FirebaseCeremony[]>([]);
  const [articles, setArticles] = React.useState<FirebaseArticle[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!query.trim()) {
        setSongs([]);
        setCeremonies([]);
        setArticles([]);
        return;
      }

      setLoading(true);
      try {
        if (activeTab === "songs") {
          setCeremonies([]);
          setArticles([]);
          setSongs(await searchSongs(query));
        } else if (activeTab === "ceremonies") {
          setSongs([]);
          setArticles([]);
          setCeremonies(await searchCeremonies(query));
        } else {
          setSongs([]);
          setCeremonies([]);
          setArticles(await searchArticles(query));
        }
      } catch {
        setSongs([]);
        setCeremonies([]);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [query, activeTab]);

  if (!query.trim()) return null;

  if (loading) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground">
        <Loader2 className="mr-2 inline-block size-4 animate-spin" />
        Searching {activeTab}...
      </div>
    );
  }

  const hasResults =
    activeTab === "songs"
      ? songs.length > 0
      : activeTab === "ceremonies"
        ? ceremonies.length > 0
        : articles.length > 0;

  if (!hasResults) {
    const emptyMessage =
      activeTab === "songs"
        ? "No Songs Found"
        : activeTab === "ceremonies"
          ? "No Ceremonies Found"
          : "No Articles Found";

    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const sectionLabel = getContentTypeLabel(activeTab);

  return (
    <div className="w-full space-y-3 py-4">
      <p className="font-heading text-lg font-semibold">{sectionLabel}</p>

      <div className="flex max-h-96 w-full flex-col gap-2 overflow-y-auto pr-2">
        {activeTab === "songs" &&
          songs.map((song) => {
            const englishTitle = song.englishTitle ?? song.title ?? "";
            const teluguTitle = song.teluguTitle ?? "";
            const href = `/songs/${encodeURIComponent(song.id)}`;

            return (
              <SearchResultRow
                key={song.id}
                href={href}
                title={englishTitle}
                subtitle={teluguTitle}
                coverUrl={getSongCoverUrl(song.imageUrl)}
              />
            );
          })}

        {activeTab === "ceremonies" &&
          ceremonies.map((ceremony) => (
            <SearchResultRow
              key={ceremony.id}
              href={`/ceremonies/${encodeURIComponent(ceremony.id)}`}
              title={ceremony.title}
              subtitle={ceremony.subtitle}
              coverUrl={getSongCoverUrl(ceremony.coverImage)}
            />
          ))}

        {activeTab === "articles" &&
          articles.map((article) => (
            <SearchResultRow
              key={article.id}
              href={`/articles/${encodeURIComponent(article.id)}`}
              title={article.title}
              subtitle={article.shortDescription}
              meta={article.author}
              coverUrl={getSongCoverUrl(article.coverImage)}
            />
          ))}
      </div>
    </div>
  );
}

function SearchResultRow({
  href,
  title,
  subtitle,
  meta,
  coverUrl,
}: {
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
  coverUrl: string;
}) {
  return (
    <ProtectedContentLink
      href={href}
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
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {title}
        </h3>
        {subtitle ? (
          <p className="line-clamp-1 text-xs leading-tight text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
        {meta ? (
          <p className="line-clamp-1 text-[11px] font-medium text-primary/70">
            {meta}
          </p>
        ) : null}
      </div>

      <div className="ml-auto shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary">
        <ChevronRight className="h-5 w-5" />
      </div>
    </ProtectedContentLink>
  );
}
