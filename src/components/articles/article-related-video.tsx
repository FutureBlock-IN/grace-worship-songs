"use client";

import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isValidYouTubeUrl } from "@/lib/media-url-validation";

type ArticleRelatedVideoProps = {
  youtubeUrl?: string;
};

export function ArticleRelatedVideo({ youtubeUrl }: ArticleRelatedVideoProps) {
  const url = youtubeUrl?.trim() ?? "";
  if (!url || !isValidYouTubeUrl(url)) return null;

  return (
    <Button asChild variant="outline" className="gap-2 rounded-full">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="h-4 w-4" aria-hidden />
        Watch Related Video
      </a>
    </Button>
  );
}
