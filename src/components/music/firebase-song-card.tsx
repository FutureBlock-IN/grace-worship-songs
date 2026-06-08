import Link from "next/link";

import type { FirebaseSong } from "@/types/firebase-song";

import { ImageWithFallback } from "@/components/image-with-fallback";

import { DEFAULT_SONG_COVER } from "@/config/site";
import { cn, getSongCoverUrl } from "@/lib/utils";

type FirebaseSongCardProps = {
  song: FirebaseSong;
  className?: string;
};

export function FirebaseSongCard({ song, className }: FirebaseSongCardProps) {
  if (!song.id?.trim()) {
    return null;
  }

  const songHref = `/songs/${encodeURIComponent(song.id)}`;
  const coverUrl = getSongCoverUrl(song.imageUrl);

  return (
    <Link
      href={songHref}
      className={cn(
        "group flex w-full max-w-[250px] flex-col overflow-hidden rounded-md border border-border/70 bg-card/30 transition-colors duration-200 hover:border-border hover:bg-accent/30",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden border-b border-border/40">
        <ImageWithFallback
          src={coverUrl}
          fallback={DEFAULT_SONG_COVER}
          width={220}
          height={220}
          sizes="(min-width: 1024px) 220px, (min-width: 768px) 25vw, 50vw"
          alt={song.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {song.youtubeUrl?.trim() ? (
          <span className="absolute top-2 right-2 z-10 rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
            YouTube
          </span>
        ) : null}
      </div>

      <div className="px-2 py-1.5 sm:px-2.5 sm:py-2">
        <h3 className="truncate text-center text-xs font-semibold text-foreground transition-colors group-hover:text-primary sm:text-sm">
          {song.title}
        </h3>
      </div>
    </Link>
  );
}

