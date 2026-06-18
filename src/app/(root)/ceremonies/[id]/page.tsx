import { notFound } from "next/navigation";

import { ContentAuthRequired } from "@/components/auth/content-auth-required";
import { BackButton } from "@/components/back-button";
import { ContentCreatedDate } from "@/components/content-created-date";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { ReadingProse } from "@/components/reading-prose";
import { DEFAULT_SONG_COVER, siteConfig } from "@/config/site";
import { isAuthenticatedServer } from "@/lib/auth-server";
import { getCeremonyById } from "@/lib/firebase-ceremony-queries";
import { getSongCoverUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type CeremonyPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CeremonyPageProps) {
  const { id } = await params;
  const ceremony = await getCeremonyById(decodeURIComponent(id));

  if (!ceremony || !ceremony.isPublished) {
    return { title: "Ceremony Not Found" };
  }

  return {
    title: `${ceremony.title} | ${siteConfig.name}`,
    description: ceremony.description.slice(0, 160),
  };
}

export default async function CeremonyPage({ params }: CeremonyPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const callbackPath = `/ceremonies/${encodeURIComponent(decodedId)}`;
  const isAuthenticated = await isAuthenticatedServer();

  if (!isAuthenticated) {
    return <ContentAuthRequired callbackPath={callbackPath} />;
  }

  const ceremony = await getCeremonyById(decodedId);

  if (!ceremony || !ceremony.isPublished) {
    notFound();
  }

  const coverUrl = getSongCoverUrl(ceremony.coverImage);

  return (
    <article className="mx-auto w-full max-w-3xl space-y-6">
      <div className="pt-1 sm:pt-0">
        <BackButton />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
          <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-border/50 sm:mx-0">
            <ImageWithFallback
              src={coverUrl}
              fallback={DEFAULT_SONG_COVER}
              width={160}
              height={160}
              alt={ceremony.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center space-y-2.5 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/60">
              {ceremony.category}
            </p>
            <h1 className="font-sans text-[2rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2.5rem]">
              {ceremony.title}
            </h1>
            {ceremony.subtitle ? (
              <p className="text-base font-normal leading-relaxed text-muted-foreground">
                {ceremony.subtitle}
              </p>
            ) : null}
            <div className="pt-1">
              <ContentCreatedDate timestamp={ceremony.dateCreated} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 py-2 sm:px-2 sm:py-4">
        <ReadingProse content={ceremony.description} />
      </div>
    </article>
  );
}
