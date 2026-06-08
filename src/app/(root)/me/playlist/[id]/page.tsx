import { notFound } from "next/navigation";

import type { Metadata } from "next";

import { ImageCollage } from "@/components/image-collage";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { getPlaylistDetails } from "@/lib/db/queries";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const playlist = await getPlaylistDetails(id);

  if (!playlist) {
    return {
      title: "Unknown Playlist",
      description: "This playlist does not exist.",
    };
  }

  return {
    title: playlist.name,
    description: playlist.description,
    openGraph: {
      title: playlist.name,
      description: playlist.description ?? "No description available",
      url: `/me/playlist/${id}`,
    },
  };
}

export default async function MyPlaylistsPage(props: Props) {
  const { id } = await props.params;

  const playlist = await getPlaylistDetails(id);

  if (!playlist) {
    return notFound();
  }

  const { name, description, songs } = playlist;

  const imageSrcs = [DEFAULT_SONG_COVER];

  return (
    <div className="space-y-4">
      <figure className="mb-10 flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-start lg:gap-10">
        <div className="relative aspect-square w-44 shrink-0 overflow-hidden rounded-md border p-1 shadow-md transition-[width_shadow] duration-500 hover:shadow-xl md:w-56 xl:w-64">
          <ImageCollage src={imageSrcs} />

          <Skeleton className="absolute inset-0 -z-10" />
        </div>

        <figcaption className="flex w-full flex-col items-center justify-center overflow-hidden font-medium lg:items-start lg:gap-2 lg:p-1">
          <h1
            title={name}
            className="flex items-center truncate text-center font-heading text-xl capitalize drop-shadow-md dark:bg-gradient-to-br dark:from-neutral-200 dark:to-neutral-600 dark:bg-clip-text dark:text-transparent sm:text-2xl md:text-3xl lg:text-start"
          >
            {name}
          </h1>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{description}</p>
            <p>
              <span>{songs.length} Songs</span>
            </p>
          </div>
        </figcaption>
      </figure>

      <div className="h-96">
        <h3 className="py-6 text-center font-heading text-xl drop-shadow-md dark:bg-gradient-to-br dark:from-neutral-200 dark:to-neutral-600 dark:bg-clip-text dark:text-transparent sm:text-2xl md:text-3xl">
          <em>Nothing to see here</em> 😢
          <p>Try adding songs to the playlist</p>
        </h3>
      </div>
    </div>
  );
}
