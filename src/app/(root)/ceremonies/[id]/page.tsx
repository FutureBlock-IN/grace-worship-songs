import { notFound } from "next/navigation";

import { ContentAuthRequired } from "@/components/auth/content-auth-required";
import { ReadingDetailLayout } from "@/components/reading-detail-layout";
import { ShareContentButton } from "@/components/share-content-button";
import { siteConfig } from "@/config/site";
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
    <ReadingDetailLayout
      coverUrl={coverUrl}
      coverAlt={ceremony.title}
      category={ceremony.category}
      title={ceremony.title}
      subtitle={ceremony.subtitle}
      dateCreated={ceremony.dateCreated}
      content={ceremony.description}
      headerAction={
        <ShareContentButton
          title={ceremony.title}
          description={ceremony.subtitle ?? ceremony.description.slice(0, 160)}
          path={`/ceremonies/${encodeURIComponent(ceremony.id)}`}
        />
      }
    />
  );
}
