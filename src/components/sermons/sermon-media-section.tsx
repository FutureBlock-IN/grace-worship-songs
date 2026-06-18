"use client";

import { FirebaseSongPlayer } from "@/components/music/firebase-song-player";
import { getYouTubeEmbedUrl } from "@/lib/media-url-validation";

type SermonMediaSectionProps = {
  title: string;
  youtubeUrl?: string;
  audioUrl?: string;
};

export function SermonMediaSection({
  title,
  youtubeUrl,
  audioUrl,
}: SermonMediaSectionProps) {
  const embedSrc = youtubeUrl ? getYouTubeEmbedUrl(youtubeUrl) : null;
  const audio = audioUrl?.trim() ?? "";

  if (!embedSrc && !audio) return null;

  return (
    <div className="space-y-6">
      {embedSrc ? (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/40">
          <div className="aspect-video w-full">
            <iframe
              src={embedSrc}
              title={`YouTube video for ${title}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      {audio ? (
        <FirebaseSongPlayer audioUrl={audio} title={title} />
      ) : null}
    </div>
  );
}
