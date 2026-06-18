"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { FirebaseAuthProvider } from "@/context/firebase-auth-context";
import { ContentAuthDialogProvider } from "@/context/content-auth-dialog-context";
import { Toaster } from "./ui/sonner";
import { TooltipProvider } from "./ui/tooltip";

type Props = {
  theme?: ThemeProviderProps;
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

export default function Providers({ children, theme }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem
      defaultTheme="system"
      storageKey="cfp-theme"
      disableTransitionOnChange
      themes={["light", "dark", "system"]}
      {...theme}
    >
      <FirebaseAuthProvider>
        <ContentAuthDialogProvider>
          <SessionProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>{children}</TooltipProvider>
            </QueryClientProvider>
          </SessionProvider>
        </ContentAuthDialogProvider>
      </FirebaseAuthProvider>

      <Toaster />
    </ThemeProvider>
  );
}

