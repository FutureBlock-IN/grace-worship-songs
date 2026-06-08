"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import type { FirebaseSong } from "@/types/firebase-song";

import { FirebaseSongCard } from "@/components/music/firebase-song-card";
import { db } from "@/lib/firebase";



type FirebaseSongsSectionProps = {
  songs: FirebaseSong[];
};

function normalizeSongData(
  id: string,
  data: Record<string, unknown>
): FirebaseSong {
  const createdAtValue = data.createdAt as any;
  const createdAt =
    createdAtValue &&
    typeof createdAtValue === "object" &&
    typeof createdAtValue.toMillis === "function"
      ? createdAtValue.toMillis()
      : typeof createdAtValue === "number"
      ? createdAtValue
      : Date.now();

  return {
    id,
    title: String(data.title ?? ""),
    lyrics: String(data.lyrics ?? data.teluguLyrics ?? ""),
    transliteratedLyrics: String(
      data.transliteratedLyrics ?? data.englishLyrics ?? ""
    ),
    imageUrl: String(data.imageUrl ?? data.coverImageUrl ?? "") || undefined,
    audioUrl: String(data.audioUrl ?? data.audioFileUrl ?? "") || undefined,
    createdAt,
  };
}

export function FirebaseSongsSection({ songs }: FirebaseSongsSectionProps) {
  const [liveSongs, setLiveSongs] = useState<FirebaseSong[]>(songs);

  useEffect(() => {
    const songsQuery = query(
      collection(db, "songs"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      songsQuery,
      (snapshot) => {
        setLiveSongs(
          snapshot.docs.map((doc) =>
            normalizeSongData(doc.id, doc.data() as Record<string, unknown>)
          )
        );
      },
      (error) => {
        console.error("[FirebaseSongsSection] Firestore snapshot failed:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  if (liveSongs.length === 0) {
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
        {liveSongs.map((song) => (
          <FirebaseSongCard
            key={song.id}
            song={song}
            className="w-full max-w-[250px] justify-self-center sm:justify-self-stretch"
          />
        ))}
      </div>
    </section>
  );
}

