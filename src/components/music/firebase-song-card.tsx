// import Link from "next/link";

// import type { FirebaseSong } from "@/types/firebase-song";

// import { ImageWithFallback } from "@/components/image-with-fallback";

// import { DEFAULT_SONG_COVER } from "@/config/site";
// import { cn, getSongCoverUrl } from "@/lib/utils";

// type FirebaseSongCardProps = {
//   song: FirebaseSong;
//   className?: string;
// };

// export function FirebaseSongCard({ song, className }: FirebaseSongCardProps) {
//   if (!song.id?.trim()) {
//     return null;
//   }

//   const songHref = `/songs/${encodeURIComponent(song.id)}`;
//   const coverUrl = getSongCoverUrl(song.imageUrl);

//   return (
//     <Link
//       href={songHref}
//       className={cn(
//         "group flex w-full max-w-[250px] flex-col overflow-hidden rounded-md border border-border/70 bg-card/30 transition-colors duration-200 hover:border-border hover:bg-accent/30",
//         className
//       )}
//     >
//       <div className="relative aspect-square w-full overflow-hidden border-b border-border/40">
//         <ImageWithFallback
//           src={coverUrl}
//           fallback={DEFAULT_SONG_COVER}
//           width={220}
//           height={220}
//           sizes="(min-width: 1024px) 220px, (min-width: 768px) 25vw, 50vw"
//           alt={song.title}
//           className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
//         />

//         {song.youtubeUrl?.trim() ? (
//           <span className="absolute top-2 right-2 z-10 rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
//             YouTube
//           </span>
//         ) : null}
//       </div>

//       <div className="px-2 py-1.5 sm:px-2.5 sm:py-2">
//         <h3 className="truncate text-center text-xs font-semibold text-foreground transition-colors group-hover:text-primary sm:text-sm">
//           {song.title}
//         </h3>
//       </div>
//     </Link>
//   );
// }

// Calude code

// import Link from "next/link";

// import type { FirebaseSong } from "@/types/firebase-song";

// import { ImageWithFallback } from "@/components/image-with-fallback";

// import { DEFAULT_SONG_COVER } from "@/config/site";
// import { cn, getSongCoverUrl } from "@/lib/utils";

// type FirebaseSongCardProps = {
//   song: FirebaseSong;
//   className?: string;
// };

// export function FirebaseSongCard({ song, className }: FirebaseSongCardProps) {
//   if (!song.id?.trim()) {
//     return null;
//   }

//   const songHref = `/songs/${encodeURIComponent(song.id)}`;
//   const coverUrl = getSongCoverUrl(song.imageUrl);

//   return (
//     <Link
//       href={songHref}
//       className={cn(
//         "group relative flex w-full flex-col overflow-hidden rounded-xl bg-card shadow-sm",
//         "border border-border/40 transition-all duration-300",
//         "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/30",
//         className
//       )}
//     >
//       {/* Cover art */}
//       <div className="relative aspect-square w-full overflow-hidden">
//         <ImageWithFallback
//           src={coverUrl}
//           fallback={DEFAULT_SONG_COVER}
//           width={280}
//           height={280}
//           sizes="(min-width: 1280px) 220px, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 45vw"
//           alt={song.title}
//           className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
//         />

//         {/* Gradient overlay for bottom fade */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

//         {/* Play icon — appears on hover */}
//         <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm">
//             <svg
//               className="h-4 w-4 translate-x-0.5 text-primary"
//               fill="currentColor"
//               viewBox="0 0 16 16"
//             >
//               <path d="M3 2.5a.5.5 0 0 1 .765-.424l10 5.5a.5.5 0 0 1 0 .848l-10 5.5A.5.5 0 0 1 3 13.5v-11z" />
//             </svg>
//           </div>
//         </div>

//         {/* YouTube badge */}
//         {song.youtubeUrl?.trim() ? (
//           <span className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
//             <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
//             </svg>
//             YT
//           </span>
//         ) : null}
//       </div>

//       {/* Title */}
//       <div className="flex flex-col gap-0.5 px-3 py-2.5">
//         <h3 className="truncate text-center text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm">
//           {song.title}
//         </h3>
//         {/* Subtle primary accent underline that grows on hover */}
//         <div className="mx-auto h-px w-0 rounded-full bg-primary/60 transition-all duration-300 group-hover:w-8" />
//       </div>
//     </Link>
//   );
// }


// Calude code -1-plus
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { FirebaseSong } from "@/types/firebase-song";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { cn, getSongCoverUrl } from "@/lib/utils";

type FirebaseSongCardProps = {
  song: FirebaseSong;
  className?: string;
};

export function FirebaseSongCard({ song, className }: FirebaseSongCardProps) {
  if (!song.id?.trim()) return null;

  const songHref = `/songs/${encodeURIComponent(song.id)}`;
  const coverUrl = getSongCoverUrl(song.imageUrl);

  // Bilingual title — fallback to legacy title for old songs
  const englishTitle = song.englishTitle ?? song.title ?? "";
  const teluguTitle = song.teluguTitle ?? "";

  return (
    <Link
      href={songHref}
      className={cn(
        "group relative flex h-24 gap-2 rounded-lg border border-border/50 bg-card/40 transition-all duration-200",
        "hover:border-border/80 hover:bg-card/60 hover:shadow-sm",
        className
      )}
    >
      {/* Cover art — left side */}
      <div className="relative h-full w-24 shrink-0 overflow-hidden rounded-md">
        <ImageWithFallback
          src={coverUrl}
          fallback={DEFAULT_SONG_COVER}
          width={96}
          height={96}
          sizes="96px"
          alt={englishTitle}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md">
            <svg className="h-3.5 w-3.5 translate-x-0.5 text-primary" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 2.5a.5.5 0 0 1 .765-.424l10 5.5a.5.5 0 0 1 0 .848l-10 5.5A.5.5 0 0 1 3 13.5v-11z" />
            </svg>
          </div>
        </div>

        {/* YouTube badge */}
        {song.youtubeUrl?.trim() ? (
          <span className="absolute top-0.5 right-0.5 z-10 flex items-center gap-0.5 rounded-full bg-red-600 px-1 py-0 text-[8px] font-bold uppercase tracking-wide text-white shadow-sm">
            <svg className="h-1.5 w-1.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            YT
          </span>
        ) : null}
      </div>

      {/* Text content — right side */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-3 py-2">
        {/* English title — primary */}
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {englishTitle}
        </h3>

        {/* Telugu title — secondary */}
        {teluguTitle && (
          <p className="line-clamp-1 text-sm leading-tight text-muted-foreground">
            {teluguTitle}
          </p>
        )}
      </div>

      {/* Right arrow indicator */}
      <div className="flex items-center justify-center pr-3 shrink-0 text-muted-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5">
        <ChevronRight className="h-5 w-5" />
      </div>
    </Link>
  );
}