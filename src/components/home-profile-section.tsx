// import { ImageWithFallback } from "@/components/image-with-fallback";

// import { siteConfig } from "@/config/site";

// const SCRIPTURE = {
//   reference: "Psalm 104:33",
//   text: "I will sing unto the Lord as long as I live: I will sing praise to my God while I have my being.",
// };

// export function HomeProfileSection() {
//   return (
//     <section className="rounded-xl border border-border/80 bg-card/80 px-3 py-3 shadow-sm sm:px-4 sm:py-3.5">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//         <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-3.5">
//           <div className="relative shrink-0">
//             <div className="rounded-full bg-gradient-to-br from-primary/15 to-primary/5 p-0.5">
//               <ImageWithFallback
//                 src={siteConfig.profile.image || "/images/logo.png"}
//                 fallback="/images/profile.png"
//                 alt={siteConfig.profile.name}
//                 width={72}
//                 height={72}
//                 className="size-14 rounded-full border border-primary/20 object-cover sm:size-16"
//                 priority
//               />
//             </div>
//           </div>

//           <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
//             <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-primary/80 sm:text-xs">
//               {siteConfig.name}
//             </p>
//             <h1 className="font-heading text-sm font-semibold leading-snug text-foreground sm:text-base md:text-lg">
//               {siteConfig.profile.name}
//             </h1>
//             <p className="text-xs leading-snug text-muted-foreground sm:text-[0.8125rem]">
//               Christian worship music and lyrics
//             </p>
//           </div>
//         </div>

//         <div className="hidden w-px self-stretch bg-border/70 sm:block" aria-hidden />

//         <div className="border-t border-border/60 pt-3 sm:flex sm:min-w-0 sm:flex-1 sm:flex-col sm:justify-center sm:border-t-0 sm:pt-0 sm:pl-4 md:max-w-[46%] lg:max-w-[42%]">
//           <p className="mb-1.5 text-xs font-semibold tracking-wide text-primary sm:text-sm">
//             {SCRIPTURE.reference}
//           </p>
//           <blockquote className="font-script text-sm leading-snug text-foreground/85 sm:text-[0.9375rem] sm:leading-relaxed">
//             &ldquo;{SCRIPTURE.text}&rdquo;
//           </blockquote>
//         </div>
//       </div>
//     </section>
//   );
// }


// Calude code
import { ImageWithFallback } from "@/components/image-with-fallback";
import { siteConfig } from "@/config/site";

const SCRIPTURE = {
  reference: "Psalm 104:33",
  text: "I will sing unto the Lord as long as I live: I will sing praise to my God while I have my being.",
};

export function HomeProfileSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
      {/* Top primary accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

      <div className="flex flex-col gap-0 sm:flex-row">

        {/* ── Left: Profile ── */}
        <div className="flex items-center gap-4 px-5 py-5 sm:py-6 sm:flex-col sm:items-center sm:justify-center sm:px-8 sm:text-center md:min-w-[220px]">
          {/* Avatar with glow ring */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md" aria-hidden />
            <div className="relative rounded-full p-0.5 ring-2 ring-primary/30">
              <ImageWithFallback
                src={siteConfig.profile.image || "/images/logo.png"}
                fallback="/images/profile.png"
                alt={siteConfig.profile.name}
                width={80}
                height={80}
                className="size-16 rounded-full object-cover sm:size-20"
                priority
              />
            </div>
          </div>

          {/* Name & subtitle */}
          <div className="min-w-0 sm:space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/60">
              {siteConfig.name}
            </p>
            <h1 className="font-heading text-sm font-bold leading-snug text-foreground sm:text-base">
              {siteConfig.profile.name}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Christian Worship Music & Lyrics
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-border/50 sm:mx-0 sm:h-auto sm:w-px" aria-hidden />

        {/* ── Right: Scripture ── */}
        <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-5 py-5 sm:px-8 sm:py-6">
          {/* Decorative watermark cross */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.04]"
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="currentColor" className="text-primary">
              <rect x="34" y="0" width="12" height="80" rx="4" />
              <rect x="0" y="28" width="80" height="12" rx="4" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/60">
              Scripture
            </p>
            <p className="text-xs font-bold text-primary sm:text-sm">
              {SCRIPTURE.reference}
            </p>
            <blockquote className="font-script text-sm leading-relaxed text-foreground/80 sm:text-base sm:leading-relaxed">
              &ldquo;{SCRIPTURE.text}&rdquo;
            </blockquote>
          </div>
        </div>

      </div>
    </section>
  );
}