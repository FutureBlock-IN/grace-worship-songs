import { getPublishedArticles } from "@/lib/firebase-article-queries";
import { getPublishedCeremonies } from "@/lib/firebase-ceremony-queries";
import { getAllSongs } from "@/lib/firebase-queries";

import { WorshipTopItemsClient } from "./firebase-worship-top-items";

export async function FirebaseWorshipTopItems() {
  const [songs, ceremonies, articles] = await Promise.all([
    getAllSongs(),
    getPublishedCeremonies(),
    getPublishedArticles(),
  ]);

  return (
    <WorshipTopItemsClient
      songs={songs.slice(0, 12)}
      ceremonies={ceremonies.slice(0, 12)}
      articles={articles.slice(0, 12)}
    />
  );
}
