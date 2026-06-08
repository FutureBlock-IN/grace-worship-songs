"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import type { FirebaseSong } from "@/types/firebase-song";

import { ImageWithFallback } from "@/components/image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { searchSongs } from "@/lib/firebase-queries";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { getSongCoverUrl } from "@/lib/utils";

type FirebaseSongSearchProps = {
  query: string;
};

export function FirebaseSongSearch({ query }: FirebaseSongSearchProps) {
  const [songs, setSongs] = React.useState<FirebaseSong[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!query.trim()) {
        setSongs([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchSongs(query);
        setSongs(results);
      } catch {
        setSongs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  if (!query.trim()) return null;

  if (loading) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground">
        <Loader2 className="mr-2 inline-block size-4 animate-spin" />
        Searching library...
      </div>
    );
  }

  if (songs.length === 0) return null;

  return (
    <div className="space-y-3 py-4">
      <p className="font-heading text-lg font-semibold">From Your Library</p>

      <div className="grid gap-2">
        {songs.map((song) => (
          <Link
            key={song.id}
            href={song.id ? `/songs/${encodeURIComponent(song.id)}` : "/"}
            className="flex gap-3 rounded-md p-2 hover:bg-secondary"
          >
            <div className="relative aspect-square h-12 shrink-0 overflow-hidden rounded">
              <ImageWithFallback
                src={getSongCoverUrl(song.imageUrl)}
                fallback={DEFAULT_SONG_COVER}
                alt={song.title}
                width={48}
                height={48}
                className="z-10 size-full object-cover"
              />
              <Skeleton className="size-full" />
            </div>

            <div className="my-auto min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{song.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
