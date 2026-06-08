import { HomeProfileSection } from "@/components/home-profile-section";
import { FirebaseSongsSection } from "@/components/music/firebase-songs-section";
import { siteConfig } from "@/config/site";
import { getAllSongs } from "@/lib/firebase-queries";

const title = siteConfig.name;
const description = `Listen to Christian music and read Telugu and English lyrics on ${siteConfig.name}.`;

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    images: {
      url: `/api/og?title=${title}&description=${description}&image=https://graph.org/file/16937ebb693470d804f31.png`,
      alt: `${siteConfig.name} Homepage`,
    },
  },
};

export default async function HomePage() {
  const songs = await getAllSongs();

  return (
    <div className="space-y-5 sm:space-y-6">
      <HomeProfileSection />
      <FirebaseSongsSection songs={songs} />
    </div>
  );
}
