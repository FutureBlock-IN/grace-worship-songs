import type { FirebaseArticle } from "@/types/firebase-article";

import { ArticleContent } from "@/components/articles/article-content";
import { ArticleNavigation } from "@/components/articles/article-navigation";
import { RelatedArticles } from "@/components/articles/related-articles";
import { ShareArticleButton } from "@/components/articles/share-article-button";
import { BackButton } from "@/components/back-button";
import { ContentCreatedDate } from "@/components/content-created-date";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { DEFAULT_SONG_COVER } from "@/config/site";
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
  const category = article.tags[0];

  return (
    <article className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4 pt-1 sm:pt-0">
        <BackButton label="Back to Articles" fallbackHref="/" />
        <ShareArticleButton
          title={article.title}
          articleId={article.id}
          shortDescription={article.shortDescription}
        />
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
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center space-y-2.5 text-left">
            {category ? (
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/60">
                {category}
              </p>
            ) : null}
            <h1 className="font-sans text-[2rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2.5rem]">
              {article.title}
            </h1>
            {article.shortDescription ? (
              <p className="text-base font-normal leading-relaxed text-muted-foreground">
                {article.shortDescription}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
              {article.author ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    By {article.author}
                  </span>
                  <span aria-hidden className="text-sm text-muted-foreground/60">
                    ·
                  </span>
                </>
              ) : null}
              <ContentCreatedDate timestamp={article.dateCreated} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 py-2 sm:px-2 sm:py-4">
        <ArticleContent content={article.content} />
      </div>

      <ArticleNavigation previous={previousArticle} next={nextArticle} />

      <RelatedArticles articles={relatedArticles} />
    </article>
  );
}
