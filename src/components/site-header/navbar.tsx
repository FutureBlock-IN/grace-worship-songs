import Image from "next/image";
import { ImageWithFallback } from "@/components/image-with-fallback";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { FirebaseTopSongs } from "../search/firebase-top-songs";
import { SearchMenu } from "../search/search-menu";
import { ThemeToggleGroup } from "../site-footer/theme-toggle-group";

export async function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      suppressHydrationWarning
    >
      <div className="mx-auto flex h-14 min-w-0 items-center gap-3 px-3 sm:h-16 sm:px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 sm:gap-4">
          <ImageWithFallback
            src={siteConfig.image || "/images/logo.png"}
            fallback="/images/logo.png"
            alt={siteConfig.name}
            width={44}
            height={44}
            className="h-11 w-11 object-contain rounded-full sm:h-12 sm:w-12"
            priority
          />
          <span className="hidden font-heading text-sm font-semibold text-foreground sm:inline md:text-base">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 justify-center px-1 sm:px-2 md:px-4">
          <SearchMenu
            topSearch={<FirebaseTopSongs />}
            className="w-full max-w-[240px] sm:max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>

        <nav className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Link
            href="/privacy"
            className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:text-sm"
          >
            Privacy
          </Link>
          <ThemeToggleGroup />
        </nav>
      </div>
    </header>
  );
}
