"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { AuthLoading } from "@/components/auth/auth-loading";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/context/firebase-auth-context";
import { hasQaAdminSession } from "@/lib/qa-admin-access";

type RequireAdminProps = {
  children: React.ReactNode;
};

/** Client-side guard for admin-only pages... */
export function RequireAdmin({ children }: RequireAdminProps) {
  const { user, isAdmin, loading } = useFirebaseAuth();
  const router = useRouter();
  const [qaReady, setQaReady] = React.useState(false);
  const [qaAccess, setQaAccess] = React.useState(false);

  React.useEffect(() => {
    setQaAccess(hasQaAdminSession());
    setQaReady(true);
  }, []);

  React.useEffect(() => {
    if (qaAccess) return;
    if (!loading && !user) {
      router.replace("/signin");
    }
  }, [user, loading, router, qaAccess]);

  if (!qaReady) return <AuthLoading />;
  if (qaAccess) return <>{children}</>;

  if (loading) return <AuthLoading />;
  if (!user) return <AuthLoading />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="font-heading text-2xl font-bold">Access Denied</h1>
        <p className="max-w-md text-muted-foreground">
          You do not have permission to access this page. Admin privileges are
          required.
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
