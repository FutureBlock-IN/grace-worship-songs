import { ImageWithFallback } from "@/components/image-with-fallback";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type ProfileBlockProps = {
  variant: "mobile" | "desktop";
};

export function ProfileBlock({ variant }: ProfileBlockProps) {
  const isMobile = variant === "mobile";

  return (
    <div
      className={cn(
        "flex items-center gap-3 text-left",
        isMobile
          ? "py-2.5"
          : "p-4 sm:min-w-[240px] sm:max-w-xs sm:shrink-0 md:min-w-[260px] lg:p-5"
      )}
    >
      <div className="relative shrink-0">
        <ImageWithFallback
          src={siteConfig.profile.image || "/images/logo.png"}
          fallback="/images/profile.png"
          alt={siteConfig.profile.name}
          width={64}
          height={64}
          className={cn(
            "rounded-full object-cover ring-2 ring-primary/25",
            isMobile ? "size-11" : "size-12 sm:size-14"
          )}
          priority
        />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/60">
          {siteConfig.name}
        </p>
        <h1
          className={cn(
            "font-heading font-bold leading-snug text-foreground",
            isMobile
              ? "line-clamp-2 text-sm"
              : "truncate text-sm sm:text-base"
          )}
        >
          {siteConfig.profile.name}
        </h1>
        <p
          className={cn(
            "mt-0.5 text-left text-xs text-muted-foreground",
            isMobile ? "line-clamp-1" : "truncate"
          )}
        >
          Christian Worship Music &amp; Lyrics
        </p>
      </div>
    </div>
  );
}

type MobileHeroBarProps = {
  mode: "fixed" | "spacer";
};

export function MobileHeroBar({ mode }: MobileHeroBarProps) {
  const isFixed = mode === "fixed";

  return (
    <section
      aria-label={isFixed ? siteConfig.name : undefined}
      aria-hidden={!isFixed}
      className={cn(
        "w-full border-b border-border/50 bg-background/95 md:hidden",
        isFixed ?
          "fixed inset-x-0 top-14 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:top-16"
        : "invisible pointer-events-none"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4">
        <ProfileBlock variant="mobile" />
      </div>
    </section>
  );
}
