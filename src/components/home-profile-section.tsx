import Image from "next/image";
import { ImageWithFallback } from "@/components/image-with-fallback";

import { siteConfig } from "@/config/site";

const SCRIPTURE = {
  reference: "Psalm 104:33",
  text: "I will sing unto the Lord as long as I live: I will sing praise to my God while I have my being.",
};

export function HomeProfileSection() {
  return (
    <section className="rounded-xl border border-border/80 bg-card/80 px-3 py-3 shadow-sm sm:px-4 sm:py-3.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-3.5">
          <div className="relative shrink-0">
            <div className="rounded-full bg-gradient-to-br from-primary/15 to-primary/5 p-0.5">
              <ImageWithFallback
                src={siteConfig.profile.image || "/images/logo.png"}
                fallback="/images/profile.png"
                alt={siteConfig.profile.name}
                width={72}
                height={72}
                className="size-14 rounded-full border border-primary/20 object-cover sm:size-16"
                priority
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-primary/80 sm:text-xs">
              {siteConfig.name}
            </p>
            <h1 className="font-heading text-sm font-semibold leading-snug text-foreground sm:text-base md:text-lg">
              {siteConfig.profile.name}
            </h1>
            <p className="text-xs leading-snug text-muted-foreground sm:text-[0.8125rem]">
              Christian worship music and lyrics
            </p>
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-border/70 sm:block" aria-hidden />

        <div className="border-t border-border/60 pt-3 sm:flex sm:min-w-0 sm:flex-1 sm:flex-col sm:justify-center sm:border-t-0 sm:pt-0 sm:pl-4 md:max-w-[46%] lg:max-w-[42%]">
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-primary sm:text-sm">
            {SCRIPTURE.reference}
          </p>
          <blockquote className="font-script text-sm leading-snug text-foreground/85 sm:text-[0.9375rem] sm:leading-relaxed">
            &ldquo;{SCRIPTURE.text}&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
