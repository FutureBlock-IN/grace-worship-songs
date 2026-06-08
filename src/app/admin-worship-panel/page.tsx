"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import type { FirebaseSong } from "@/types/firebase-song";

import { Button } from "@/components/ui/button";
import { AddMusicModal } from "@/components/admin/add-music-modal";
import { MusicList } from "@/components/admin/music-list";
import { db } from "@/lib/firebase";

export default function AdminPage() {
  const [songs, setSongs] = useState<FirebaseSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<FirebaseSong | null>(null);

  useEffect(() => {
    const songsQuery = query(
      collection(db, "songs"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      songsQuery,
      (snapshot) => {
        setSongs(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            title: String(doc.data().title ?? ""),
            lyrics: String(doc.data().lyrics ?? doc.data().teluguLyrics ?? ""),
            transliteratedLyrics: String(
              doc.data().transliteratedLyrics ?? doc.data().englishLyrics ?? ""
            ),
            imageUrl: String(doc.data().imageUrl ?? doc.data().coverImageUrl ?? "") || undefined,
            audioUrl: String(doc.data().audioUrl ?? doc.data().audioFileUrl ?? "") || undefined,
            createdAt:
              typeof doc.data().createdAt === "object" &&
              doc.data().createdAt !== null &&
              typeof (doc.data().createdAt as { toMillis(): number }).toMillis === "function"
                ? (doc.data().createdAt as { toMillis(): number }).toMillis()
                : Date.now(),
          }))
        );
        setLoading(false);
      },
      (error) => {
        console.error("[AdminPage] Firestore snapshot failed:", error);
        toast.error("Unable to sync songs in real time");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  function handleAddMusic() {
    setSelectedSong(null);
    setIsModalOpen(true);
  }

  function handleEditSong(song: FirebaseSong) {
    setSelectedSong(song);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedSong(null);
  }

  function handleSongSaved() {
    handleCloseModal();
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Music Admin</h1>
          <p className="mt-2 text-muted-foreground">
            Manage songs, uploads, and lyrics
          </p>
        </div>

        <Button size="lg" onClick={handleAddMusic} className="gap-2">
          <Plus className="h-5 w-5" />
          Add Music
        </Button>
      </div>

      <AddMusicModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSongSaved}
        initialSong={selectedSong}
      />

      <MusicList
        songs={songs}
        loading={loading}
        onEdit={handleEditSong}
        onDelete={() => {
          /* Real-time snapshot keeps songs current */
        }}
      />
    </div>
  );
}
