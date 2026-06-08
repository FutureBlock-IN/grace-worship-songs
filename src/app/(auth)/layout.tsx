import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { AuthModeToggle } from "./_components/auth-mode-toggle";
import { siteConfig } from "@/config/site";

type AuthLayoutProps = React.PropsWithChildren;

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  const imageUrl = "/images/logo.png";

  return (
    <div className="grid h-screen lg:grid-cols-2">
      <div className="hidden h-full bg-zinc-900 p-10 text-white dark:border-r lg:flex lg:flex-col lg:justify-between">
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "sm" }),
            "group w-fit border border-zinc-600 duration-200 hover:ring-2 hover:ring-zinc-600 hover:ring-offset-2 hover:ring-offset-zinc-900"
          )}
        >
          <ArrowLeft className="mr-1 size-4 duration-300 group-hover:-translate-x-1" />
          Back
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-6 text-center">
          <Image
            src={imageUrl}
            width={360}
            height={360}
            alt={siteConfig.name}
            className="mx-auto max-w-[260px] rounded-3xl object-contain"
            priority
          />
          <div>
            <h2 className="font-heading text-4xl">{siteConfig.name}</h2>
            <p className="mt-3 text-lg text-muted-foreground">Christian worship music and lyrics</p>
          </div>
        </div>

        <div className="mb-20 text-center 2xl:mb-32">
          <h2 className="font-heading text-5xl">All Your Music.</h2>
          <em className="text-2xl text-muted-foreground">Anytime, anywhere.</em>
        </div>
      </div>

      <AuthModeToggle />

      <div className="m-auto flex w-full flex-col justify-center space-y-6 p-8 sm:w-[350px] sm:p-0">
        <Image
          src={imageUrl}
          width={120}
          height={120}
          alt={siteConfig.name}
          className="mx-auto h-28 w-28 rounded-3xl object-contain"
          priority
        />
        {children}
        <p className="mx-auto px-10 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 outline-none hover:text-foreground hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 outline-none hover:text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
