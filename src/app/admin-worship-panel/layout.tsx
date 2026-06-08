import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header
        className="sticky top-0 z-50 w-full border-b bg-background"
        suppressHydrationWarning
      >
        <div className="container flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-heading text-lg font-bold text-white hidden xl:inline">
              Admin Panel
            </span>
          </div>
          <div className="w-12" />
        </div>
      </header>
      {children}
    </div>
  );
}
