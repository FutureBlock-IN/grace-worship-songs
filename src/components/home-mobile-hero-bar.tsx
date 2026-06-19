"use client";

import { usePathname } from "next/navigation";

import { MobileHeroBar } from "@/components/home-hero-blocks";

export function HomeMobileHeroBar() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <>
      <MobileHeroBar mode="fixed" />
      <MobileHeroBar mode="spacer" />
    </>
  );
}
