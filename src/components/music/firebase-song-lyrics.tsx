"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLyricsDisplayContent } from "@/lib/song-lyrics";
import { cn } from "@/lib/utils";

type FirebaseSongLyricsProps = {
  lyrics: string;
  transliteratedLyrics?: string;
  songTitle?: string;
};

function LyricsBlock({ content }: { content: string }) {
  if (!content.trim()) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No lyrics available for this language.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {content.split("\n").map((line, index) => (
        <p
          key={`${index}-${line.slice(0, 12)}`}
          className={cn(
            "text-[0.875rem] leading-[1.6] sm:text-[0.9375rem] sm:leading-[1.65]",
            line.trim() ? "text-foreground/90" : "h-2"
          )}
        >
          {line.trim() || "\u00A0"}
        </p>
      ))}
    </div>
  );
}

export function FirebaseSongLyrics({
  lyrics,
  transliteratedLyrics,
  songTitle,
}: FirebaseSongLyricsProps) {
  const { teluguDisplay: telugu, englishDisplay: english } =
    getLyricsDisplayContent(lyrics, transliteratedLyrics);

  if (!telugu && !english) {
    return null;
  }

  return (
    <section className="w-full min-w-0">
      {songTitle && (
        <h1 className="mb-4 font-heading text-xl font-bold leading-snug text-foreground sm:text-2xl">
          {songTitle}
        </h1>
      )}

      <Tabs defaultValue={telugu ? "telugu" : "english"} className="w-full">
        <TabsList className="mb-4 grid h-9 w-full max-w-xs grid-cols-2 rounded-md bg-muted p-0.5">
          <TabsTrigger
            value="telugu"
            className="rounded-sm text-xs font-medium sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Telugu Lyrics
          </TabsTrigger>
          <TabsTrigger
            value="english"
            className="rounded-sm text-xs font-medium sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            English Lyrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="telugu" className="mt-0 focus-visible:outline-none">
          <div className="rounded-lg border border-border/60 bg-card/30 px-4 py-4 sm:px-5 sm:py-5">
            <LyricsBlock content={telugu} />
          </div>
        </TabsContent>

        <TabsContent value="english" className="mt-0 focus-visible:outline-none">
          <div className="rounded-lg border border-border/60 bg-card/30 px-4 py-4 sm:px-5 sm:py-5">
            <LyricsBlock content={english} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
