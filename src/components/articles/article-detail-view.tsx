import type { FirebaseArticle } from "@/types/firebase-article";

import { ArticleNavigation } from "@/components/articles/article-navigation";
import { RelatedArticles } from "@/components/articles/related-articles";
import { ReadingDetailLayout } from "@/components/reading-detail-layout";
import { ShareContentButton } from "@/components/share-content-button";
import { getSongCoverUrl } from "@/lib/utils";

type ArticleDetailViewProps = {
  article: FirebaseArticle;
  relatedArticles: FirebaseArticle[];
  previousArticle: FirebaseArticle | null;
  nextArticle: FirebaseArticle | null;
};

export function ArticleDetailView({
  article,
  relatedArticles,
  previousArticle,
  nextArticle,
}: ArticleDetailViewProps) {
  const coverUrl = getSongCoverUrl(article.coverImage);

  return (
    <ReadingDetailLayout
      coverUrl={coverUrl}
      coverAlt={article.title}
      category={article.tags[0]}
      title={article.title}
      subtitle={article.shortDescription}
      author={article.author}
      authorImage={article.authorImage}
      dateCreated={article.dateCreated}
      content={article.content}
      headerAction={
        <ShareContentButton
          title={article.title}
          description={article.shortDescription}
          path={`/articles/${encodeURIComponent(article.id)}`}
        />
      }
      footer={
        <>
          <ArticleNavigation previous={previousArticle} next={nextArticle} />
          <RelatedArticles articles={relatedArticles} />
        </>
      }
    />
  );
}
