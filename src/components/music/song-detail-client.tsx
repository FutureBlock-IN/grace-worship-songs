"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CloudDownload, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { FirebaseSong } from "@/types/firebase-song";

import { FirebaseSongLyrics } from "@/components/music/firebase-song-lyrics";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCurrentSongIndex,
  useIsPlayerInit,
  useQueue,
} from "@/hooks/use-store";
import {
  generateLyricsTxt,
  getLyricsTxtFilename,
} from "@/lib/generate-lyrics-txt";
import { getSongLyricsContent } from "@/lib/song-lyrics";
import { getSongCoverUrl } from "@/lib/utils";
import { DEFAULT_SONG_COVER } from "@/config/site";

type SongDetailClientProps = {
  song: FirebaseSong;
};

function downloadBlob(content: Blob, filename: string) {
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 150);
}

export function SongDetailClient({ song }: SongDetailClientProps) {
  const [, setQueue] = useQueue();
  const [, setCurrentIndex] = useCurrentSongIndex();
  const [, setIsPlayerInit] = useIsPlayerInit();
  const [downloadingLyrics, setDownloadingLyrics] = React.useState(false);
  const [downloadingAudio, setDownloadingAudio] = React.useState(false);

  const { telugu, english, teluguDisplay, englishDisplay, hasLyrics } =
    getSongLyricsContent(song);

  const audioUrl = song.audioUrl?.trim() ?? "";
  const coverUrl = getSongCoverUrl(song.imageUrl);
  const youtubeUrl = song.youtubeUrl?.trim() ?? "";
  const [showVideo, setShowVideo] = React.useState(false);

  function getYouTubeEmbedUrl(url: string) {
    if (!url) return null;
    // Extract video id from common YouTube URL patterns
    const idMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    const id = idMatch ? idMatch[1] : null;
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  const embedSrc = getYouTubeEmbedUrl(youtubeUrl);

  React.useLayoutEffect(() => {
    if (audioUrl) {
      setQueue([
        {
          id: song.id,
          name: song.title,
          subtitle: "",
          image: coverUrl,
          duration: 0,
          download_url: audioUrl,
          url: `/songs/${encodeURIComponent(song.id)}`,
          type: "song",
          artists: [],
        },
      ]);
      setCurrentIndex(0);
      setIsPlayerInit(true);
    } else {
      setQueue([]);
      setCurrentIndex(0);
      setIsPlayerInit(false);
    }
  }, [
    song.id,
    audioUrl,
    song.title,
    coverUrl,
    teluguDisplay,
    setQueue,
    setCurrentIndex,
    setIsPlayerInit,
  ]);

  async function handleDownloadLyrics() {
    if (!hasLyrics) {
      toast.error("No lyrics available to download");
      return;
    }

    setDownloadingLyrics(true);
    try {
      const txtBlob = generateLyricsTxt({
        title: song.title,
        teluguLyrics: telugu,
        englishLyrics: english,
      });

      downloadBlob(txtBlob, getLyricsTxtFilename(song.title));
      toast.success("Lyrics downloaded");
    } catch {
      toast.error("Failed to download lyrics");
    } finally {
      setDownloadingLyrics(false);
    }
  }

  async function handleDownloadAudio() {
    if (!audioUrl) return;

    setDownloadingAudio(true);
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }

      const blob = await response.blob();
      const extension = audioUrl.split(".").pop()?.split("?")[0] || "mp3";
      downloadBlob(blob, `${song.title}.${extension}`);
      toast.success("Audio downloaded");
    } catch {
      toast.error("Failed to download audio");
    } finally {
      setDownloadingAudio(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Songs
      </Link>

      <div className="grid gap-6 md:grid-cols-[minmax(120px,160px)_1fr] md:gap-8 lg:grid-cols-[minmax(140px,180px)_1fr]">
        <aside className="flex flex-row items-start gap-4 md:flex-col md:items-stretch md:gap-3 lg:items-start">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-lg border border-border/70 sm:size-32 md:size-36 lg:size-40">
            <ImageWithFallback
              src={coverUrl}
              fallback={DEFAULT_SONG_COVER}
              width={160}
              height={160}
              sizes="(min-width: 1024px) 160px, 128px"
              alt={song.title}
              className="size-full object-cover"
            />
            <Skeleton className="absolute inset-0 -z-10 size-full" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2 md:w-full">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-9 w-full gap-2 rounded-md px-3 text-sm font-medium shadow-sm"
              disabled={!hasLyrics || downloadingLyrics}
              onClick={handleDownloadLyrics}
            >
              {downloadingLyrics ?
                <Loader2 className="size-4 shrink-0 animate-spin" />
              : <Download className="size-4 shrink-0" />}
              Download
            </Button>

            {audioUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-full gap-2 rounded-md px-3 text-sm"
                disabled={downloadingAudio}
                onClick={handleDownloadAudio}
              >
                {downloadingAudio ?
                  <Loader2 className="size-4 shrink-0 animate-spin" />
                : <CloudDownload className="size-4 shrink-0" />}
                Audio
              </Button>
            )}
          </div>
        </aside>

        <div className="min-w-0">
          {embedSrc && (
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowVideo((s) => !s)}
                >
                  {showVideo ? "Hide Video" : "Watch Song Video"}
                </Button>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground underline"
                >
                  Open on YouTube
                </a>
              </div>

              {showVideo && (
                <div className="mt-3">
                  <div className="relative overflow-hidden rounded-lg" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      src={embedSrc}
                      title={`YouTube video for ${song.title}`}
                      className="absolute inset-0 h-full w-full"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {hasLyrics ?
            <FirebaseSongLyrics
              songTitle={song.title}
              lyrics={song.lyrics}
              transliteratedLyrics={song.transliteratedLyrics}
            />
          : (
            <div className="space-y-3">
              <h1 className="font-heading text-xl font-bold leading-snug sm:text-2xl">
                {song.title}
              </h1>
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                📖 Lyrics are not available for this song.
              </div>
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
}
