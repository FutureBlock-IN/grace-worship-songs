"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import type { FirebaseCeremony } from "@/types/firebase-ceremony";

import { FirebaseCeremonyCard } from "@/components/worship/firebase-ceremony-card";
import { CollectionTabHeader } from "@/components/worship/collection-tab-header";
import { worshipContentGridClassName } from "@/components/worship/worship-card-styles";
import { TabEmptyState, TabLoadingState } from "@/components/worship/songs-tab-content";
import { db } from "@/lib/firebase";

type CeremoniesTabContentProps = {
  initialCeremonies: FirebaseCeremony[];
};

function normalizeCeremonyData(
  id: string,
  data: Record<string, unknown>
): FirebaseCeremony {
  const dateCreatedValue = data.dateCreated as unknown;
  const dateCreated =
    dateCreatedValue &&
    typeof dateCreatedValue === "object" &&
    typeof (dateCreatedValue as { toMillis(): number }).toMillis === "function"
      ? (dateCreatedValue as { toMillis(): number }).toMillis()
      : typeof dateCreatedValue === "number"
        ? dateCreatedValue
        : Date.now();

  return {
    id,
    title: String(data.title ?? ""),
    subtitle: String(data.subtitle ?? "").trim() || undefined,
    description: String(data.description ?? ""),
    coverImage: String(data.coverImage ?? "").trim() || undefined,
    category: String(data.category ?? "Other"),
    dateCreated,
    createdBy: String(data.createdBy ?? ""),
    isPublished: Boolean(data.isPublished),
  };
}

export function CeremoniesTabContent({
  initialCeremonies,
}: CeremoniesTabContentProps) {
  const [ceremonies, setCeremonies] =
    useState<FirebaseCeremony[]>(initialCeremonies);
  const [loading, setLoading] = useState(!initialCeremonies.length);

  useEffect(() => {
    const ceremoniesQuery = query(
      collection(db, "ceremonies"),
      orderBy("dateCreated", "desc")
    );

    const unsubscribe = onSnapshot(
      ceremoniesQuery,
      (snapshot) => {
        const items = snapshot.docs
          .map((docSnap) =>
            normalizeCeremonyData(
              docSnap.id,
              docSnap.data() as Record<string, unknown>
            )
          )
          .filter((c) => c.isPublished);
        setCeremonies(items);
        setLoading(false);
      },
      (error) => {
        console.error("[CeremoniesTabContent] Firestore snapshot failed:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <TabLoadingState label="Loading ceremonies..." />;
  }

  if (ceremonies.length === 0) {
    return <TabEmptyState message="No Ceremonies Found" />;
  }

  return (
    <>
      <CollectionTabHeader title="Ceremonies" count={ceremonies.length} />
      <div className={worshipContentGridClassName}>
        {ceremonies.map((ceremony) => (
          <FirebaseCeremonyCard key={ceremony.id} ceremony={ceremony} />
        ))}
      </div>
    </>
  );
}
