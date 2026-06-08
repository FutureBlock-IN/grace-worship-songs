import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
    title: song.title,
    description: `Listen to ${song.title} on ${siteConfig.name}`,
    openGraph: {
      title: song.title,
      description: `Listen to ${song.title} on ${siteConfig.name}`,
      url: `/songs/${id}`,
      siteName: siteConfig.name,
      images: song.imageUrl
        ? [{ url: song.imageUrl, alt: song.title }]
        : [{ url: "/images/logo.png", alt: siteConfig.name }],
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
