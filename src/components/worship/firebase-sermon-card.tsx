import { ProtectedContentLink } from "@/components/auth/protected-content-link";
import type { FirebaseSermon } from "@/types/firebase-sermon";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { formatContentDate } from "@/lib/content-date";
import { cn, getSongCoverUrl } from "@/lib/utils";

type FirebaseSermonCardProps = {
  sermon: FirebaseSermon;
  className?: string;
};

function getCreatorInitial(createdBy: string): string {
  const trimmed = createdBy.trim();
  if (!trimmed) return "?";
  const label = trimmed.includes("@") ? trimmed.split("@")[0]! : trimmed;
  return label.charAt(0).toUpperCase();
}

export function FirebaseSermonCard({
  sermon,
  className,
}: FirebaseSermonCardProps) {
  if (!sermon.id?.trim()) return null;

  const href = `/sermons/${encodeURIComponent(sermon.id)}`;
  const coverUrl = getSongCoverUrl(sermon.coverImage);
  const description = sermon.subtitle || sermon.description;
  const category = sermon.category.trim();

  return (
    <ProtectedContentLink
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/40 text-left transition-all duration-200 hover:-translate-y-1 hover:border-border/80 hover:bg-card/60 hover:shadow-lg hover:shadow-black/20",
        className,
      )}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
        <ImageWithFallback
          src={coverUrl}
          fallback={DEFAULT_SONG_COVER}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={sermon.title}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category ? (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 rounded-md border-0 bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-sm"
          >
            {category}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 text-left">
        <h3 className="line-clamp-2 text-left text-base font-semibold leading-snug text-foreground">
          {sermon.title}
        </h3>

        {description ? (
          <p className="line-clamp-2 text-left text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-3 text-left">
          {sermon.createdBy ? (
            <>
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted/80 text-[10px] font-semibold uppercase text-muted-foreground"
              >
                {getCreatorInitial(sermon.createdBy)}
              </span>
              <span aria-hidden className="shrink-0 text-xs text-muted-foreground/50">
                ·
              </span>
            </>
          ) : null}
          <time
            dateTime={new Date(sermon.dateCreated).toISOString()}
            className="shrink-0 text-xs text-muted-foreground/80"
          >
            {formatContentDate(sermon.dateCreated)}
          </time>
        </div>
      </div>
    </ProtectedContentLink>
  );
}
