import Link from "next/link";

import { FirebaseSongCard } from "@/components/music/firebase-song-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { getAllSongs } from "@/lib/firebase-queries";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { getSongCoverUrl } from "@/lib/utils";

export async function FirebaseTopSongs() {
  const songs = await getAllSongs();
  const preview = songs.slice(0, 12);

  if (preview.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No songs in your library yet. Add music from the admin panel.
      </p>
    );
  }

  return (
    <>
      <p className="font-heading text-xl drop-shadow-md dark:bg-gradient-to-br dark:from-neutral-200 dark:to-neutral-600 dark:bg-clip-text dark:text-transparent sm:text-2xl md:text-3xl">
        Your Library
      </p>

      <ScrollArea className="lg:hidden">
        <div className="flex space-x-4 pb-4">
          {preview.map((song) => (
            <FirebaseSongCard key={song.id} song={song} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="hidden max-w-5xl gap-2 lg:grid lg:grid-cols-3">
        {preview.map((song) => (
          <Link
            key={song.id}
            href={song.id ? `/songs/${encodeURIComponent(song.id)}` : "/"}
            className="flex gap-3 rounded-md p-2 hover:bg-secondary"
          >
            <ImageWithFallback
              src={getSongCoverUrl(song.imageUrl)}
              fallback={DEFAULT_SONG_COVER}
              width={48}
              height={48}
              alt={song.title}
              className="aspect-square h-12 w-12 shrink-0 rounded object-cover"
            />
            <div className="my-auto min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{song.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
