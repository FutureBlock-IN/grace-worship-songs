import { ArrowRight, Calendar } from "lucide-react";

import type { FirebaseArticle } from "@/types/firebase-article";

import { ProtectedContentLink } from "@/components/auth/protected-content-link";
import { ImageWithFallback } from "@/components/image-with-fallback";
import {
  worshipContentCardClassName,
  worshipContentImageClassName,
} from "@/components/worship/worship-card-styles";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { formatContentDate } from "@/lib/content-date";
import { cn, getSongCoverUrl } from "@/lib/utils";

type FirebaseArticleCardProps = {
  article: FirebaseArticle;
  className?: string;
};

export function FirebaseArticleCard({
  article,
  className,
}: FirebaseArticleCardProps) {
  if (!article.id?.trim()) return null;

  const href = `/articles/${encodeURIComponent(article.id)}`;
  const coverUrl = getSongCoverUrl(article.coverImage);

  return (
    <ProtectedContentLink
      href={href}
      className={cn(worshipContentCardClassName, className)}
    >
      <div className={worshipContentImageClassName}>
        <ImageWithFallback
          src={coverUrl}
          fallback={DEFAULT_SONG_COVER}
          width={320}
          height={180}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
          {article.title}
        </h3>

        {article.shortDescription ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.shortDescription}
          </p>
        ) : null}

        <time
          dateTime={new Date(article.dateCreated).toISOString()}
          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs text-muted-foreground/80"
        >
          <Calendar className="size-3.5 shrink-0 opacity-70" aria-hidden />
          {formatContentDate(article.dateCreated)}
        </time>

        <span className="mt-2 inline-flex w-fit items-center gap-1 self-end rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground/90 transition-colors group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:text-primary">
          View Details
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </ProtectedContentLink>
  );
}
