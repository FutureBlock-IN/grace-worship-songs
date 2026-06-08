import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SongDetailClient } from "@/components/music/song-detail-client";
import { siteConfig } from "@/config/site";
import { getSongById } from "@/lib/firebase-queries";

type SongDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: SongDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const song = await getSongById(id);

  if (!song) {
    return { title: siteConfig.name };
  }

  return {
    title: siteConfig.name,
    description: `Listen to songs on ${siteConfig.name}`,
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      url: `/songs/${id}`,
      images: song.imageUrl ? { url: song.imageUrl, alt: song.title } : undefined,
    },
  };
}

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { id } = await params;
  const song = await getSongById(id);

  if (!song) {
    notFound();
  }

  return <SongDetailClient song={song} />;
}
