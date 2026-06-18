import type { WorshipCollectionTab } from "@/hooks/use-store";

export function getContentTypeFromPathname(
  pathname: string
): WorshipCollectionTab | null {
  if (pathname.startsWith("/articles")) return "articles";
  if (pathname.startsWith("/ceremonies")) return "ceremonies";
  if (pathname.startsWith("/songs")) return "songs";
  return null;
}

export function getSearchPlaceholder(tab: WorshipCollectionTab): string {
  switch (tab) {
    case "songs":
      return "Search songs...";
    case "ceremonies":
      return "Search ceremonies...";
    case "articles":
      return "Search articles...";
  }
}

export function getContentTypeLabel(tab: WorshipCollectionTab): string {
  switch (tab) {
    case "songs":
      return "Songs";
    case "ceremonies":
      return "Ceremonies";
    case "articles":
      return "Articles";
  }
}
