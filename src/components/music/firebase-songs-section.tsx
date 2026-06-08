import type { FirebaseSong } from "@/types/firebase-song";

import { FirebaseSongCard } from "@/components/music/firebase-song-card";

type FirebaseSongsSectionProps = {
  songs: FirebaseSong[];
};

export function FirebaseSongsSection({ songs }: FirebaseSongsSectionProps) {
  if (songs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          No songs available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <section className="w-full space-y-4 overflow-hidden">
      <h2 className="font-heading text-xl drop-shadow-md dark:bg-gradient-to-br dark:from-neutral-200 dark:to-neutral-600 dark:bg-clip-text dark:text-transparent sm:text-2xl md:text-3xl">
        Your Music
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-3 lg:grid-cols-5 lg:gap-3 xl:gap-3.5">
        {songs.map((song) => (
          <FirebaseSongCard key={song.id} song={song} className="w-full max-w-[250px] justify-self-center sm:justify-self-stretch" />
        ))}
      </div>
    </section>
  );
}
