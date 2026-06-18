"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Music2,
  ListMusic,
  UploadCloud,
  Church,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import type { FirebaseArticle } from "@/types/firebase-article";
import type { FirebaseCeremony } from "@/types/firebase-ceremony";
import type { FirebaseSong } from "@/types/firebase-song";

import { AddArticleModal } from "@/components/admin/add-article-modal";
import { AddCeremonyModal } from "@/components/admin/add-ceremony-modal";
import { AddMusicModal } from "@/components/admin/add-music-modal";
import { ArticleList } from "@/components/admin/article-list";
import { CeremonyList } from "@/components/admin/ceremony-list";
import { MusicList } from "@/components/admin/music-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/firebase";

type AdminTab = "songs" | "ceremonies" | "articles";

function toMillis(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    typeof (value as { toMillis(): number }).toMillis === "function"
  ) {
    return (value as { toMillis(): number }).toMillis();
  }
  return typeof value === "number" ? value : Date.now();
}

function parseAdminTab(value: string | null): AdminTab {
  if (value === "ceremonies" || value === "articles") return value;
  return "songs";
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AdminTab>(() =>
    parseAdminTab(searchParams.get("tab"))
  );

  useEffect(() => {
    setActiveTab(parseAdminTab(searchParams.get("tab")));
  }, [searchParams]);

  const [songs, setSongs] = useState<FirebaseSong[]>([]);
  const [ceremonies, setCeremonies] = useState<FirebaseCeremony[]>([]);
  const [articles, setArticles] = useState<FirebaseArticle[]>([]);

  const [songsLoading, setSongsLoading] = useState(true);
  const [ceremoniesLoading, setCeremoniesLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const [songModalOpen, setSongModalOpen] = useState(false);
  const [ceremonyModalOpen, setCeremonyModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  const [selectedSong, setSelectedSong] = useState<FirebaseSong | null>(null);
  const [selectedCeremony, setSelectedCeremony] =
    useState<FirebaseCeremony | null>(null);
  const [selectedArticle, setSelectedArticle] =
    useState<FirebaseArticle | null>(null);

  useEffect(() => {
    const songsQuery = query(
      collection(db, "songs"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      songsQuery,
      (snapshot) => {
        setSongs(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: String(data.title ?? ""),
              englishTitle: String(data.englishTitle ?? "").trim() || undefined,
              teluguTitle: String(data.teluguTitle ?? "").trim() || undefined,
              lyrics: String(data.lyrics ?? data.teluguLyrics ?? ""),
              transliteratedLyrics: String(
                data.transliteratedLyrics ?? data.englishLyrics ?? ""
              ),
              imageUrl:
                String(data.imageUrl ?? data.coverImageUrl ?? "") || undefined,
              audioUrl:
                String(data.audioUrl ?? data.audioFileUrl ?? "") || undefined,
              youtubeUrl: String(data.youtubeUrl ?? data.videoUrl ?? "") || undefined,
              playCount: typeof data.playCount === "number" ? data.playCount : 0,
              createdAt: toMillis(data.createdAt),
            };
          })
        );
        setSongsLoading(false);
      },
      () => {
        toast.error("Unable to sync songs");
        setSongsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ceremoniesQuery = query(
      collection(db, "ceremonies"),
      orderBy("dateCreated", "desc")
    );
    const unsubscribe = onSnapshot(
      ceremoniesQuery,
      (snapshot) => {
        setCeremonies(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: String(data.title ?? ""),
              subtitle: String(data.subtitle ?? "").trim() || undefined,
              description: String(data.description ?? ""),
              coverImage: String(data.coverImage ?? "").trim() || undefined,
              category: String(data.category ?? "Other"),
              dateCreated: toMillis(data.dateCreated),
              createdBy: String(data.createdBy ?? ""),
              isPublished: Boolean(data.isPublished),
            };
          })
        );
        setCeremoniesLoading(false);
      },
      () => {
        toast.error("Unable to sync ceremonies");
        setCeremoniesLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const articlesQuery = query(
      collection(db, "articles"),
      orderBy("dateCreated", "desc")
    );
    const unsubscribe = onSnapshot(
      articlesQuery,
      (snapshot) => {
        setArticles(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const tags = Array.isArray(data.tags)
              ? data.tags.map((t) => String(t).trim()).filter(Boolean)
              : [];
            return {
              id: docSnap.id,
              title: String(data.title ?? ""),
              shortDescription: String(data.shortDescription ?? ""),
              content: String(data.content ?? ""),
              coverImage: String(data.coverImage ?? "").trim() || undefined,
              author: String(data.author ?? ""),
              authorImage:
                String(data.authorImage ?? data.authorPhoto ?? "").trim() ||
                undefined,
              tags,
              dateCreated: toMillis(data.dateCreated),
              createdBy: String(data.createdBy ?? ""),
              isPublished: Boolean(data.isPublished),
            };
          })
        );
        setArticlesLoading(false);
      },
      () => {
        toast.error("Unable to sync articles");
        setArticlesLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const withAudio = songs.filter((s) => s.audioUrl).length;
  const publishedCeremonies = ceremonies.filter((c) => c.isPublished).length;
  const publishedArticles = articles.filter((a) => a.isPublished).length;

  function getAddHandler() {
    if (activeTab === "songs") {
      setSelectedSong(null);
      setSongModalOpen(true);
    } else if (activeTab === "ceremonies") {
      setSelectedCeremony(null);
      setCeremonyModalOpen(true);
    } else {
      setSelectedArticle(null);
      setArticleModalOpen(true);
    }
  }

  const addLabel =
    activeTab === "songs"
      ? "Add Song"
      : activeTab === "ceremonies"
        ? "Add Ceremony"
        : "Add Article";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Music2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/60">
                Dashboard
              </p>
              <h1 className="font-heading text-xl font-bold sm:text-2xl">
                Worship Admin
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage songs, ceremonies, and articles
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={getAddHandler}
            className="gap-2 rounded-full px-5 font-semibold shadow"
          >
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as AdminTab)}
        className="w-full space-y-6"
      >
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl border border-border/50 bg-muted/50 p-1 sm:w-auto sm:inline-flex">
          <TabsTrigger value="songs" className="rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm">
            Songs
          </TabsTrigger>
          <TabsTrigger value="ceremonies" className="rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm">
            Ceremonies
          </TabsTrigger>
          <TabsTrigger value="articles" className="rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm">
            Articles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="mt-0 space-y-4">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: <ListMusic className="h-4 w-4" />, label: "Total Songs", value: songsLoading ? "—" : songs.length },
              { icon: <UploadCloud className="h-4 w-4" />, label: "With Audio", value: songsLoading ? "—" : withAudio },
              { icon: <Music2 className="h-4 w-4" />, label: "With Lyrics", value: songsLoading ? "—" : songs.filter((s) => s.lyrics?.trim()).length },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card px-4 py-4 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">{stat.icon}</div>
                <p className="font-heading text-xl font-bold sm:text-2xl">{stat.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <MusicList
            songs={songs}
            loading={songsLoading}
            onEdit={(song) => { setSelectedSong(song); setSongModalOpen(true); }}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="ceremonies" className="mt-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { icon: <Church className="h-4 w-4" />, label: "Total Ceremonies", value: ceremoniesLoading ? "—" : ceremonies.length },
              { icon: <Church className="h-4 w-4" />, label: "Published", value: ceremoniesLoading ? "—" : publishedCeremonies },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card px-4 py-4 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">{stat.icon}</div>
                <p className="font-heading text-xl font-bold sm:text-2xl">{stat.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <CeremonyList
            ceremonies={ceremonies}
            loading={ceremoniesLoading}
            onEdit={(ceremony) => { setSelectedCeremony(ceremony); setCeremonyModalOpen(true); }}
            onDelete={() => {}}
          />
        </TabsContent>

        <TabsContent value="articles" className="mt-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { icon: <FileText className="h-4 w-4" />, label: "Total Articles", value: articlesLoading ? "—" : articles.length },
              { icon: <FileText className="h-4 w-4" />, label: "Published", value: articlesLoading ? "—" : publishedArticles },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card px-4 py-4 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">{stat.icon}</div>
                <p className="font-heading text-xl font-bold sm:text-2xl">{stat.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <ArticleList
            articles={articles}
            loading={articlesLoading}
            onEdit={(article) => { setSelectedArticle(article); setArticleModalOpen(true); }}
            onDelete={() => {}}
          />
        </TabsContent>
      </Tabs>

      <AddMusicModal
        isOpen={songModalOpen}
        onClose={() => { setSongModalOpen(false); setSelectedSong(null); }}
        onSave={() => { setSongModalOpen(false); setSelectedSong(null); }}
        initialSong={selectedSong}
      />
      <AddCeremonyModal
        isOpen={ceremonyModalOpen}
        onClose={() => { setCeremonyModalOpen(false); setSelectedCeremony(null); }}
        onSave={() => { setCeremonyModalOpen(false); setSelectedCeremony(null); }}
        initialCeremony={selectedCeremony}
      />
      <AddArticleModal
        isOpen={articleModalOpen}
        onClose={() => { setArticleModalOpen(false); setSelectedArticle(null); }}
        onSave={() => { setArticleModalOpen(false); setSelectedArticle(null); }}
        initialArticle={selectedArticle}
      />
    </div>
  );
}
