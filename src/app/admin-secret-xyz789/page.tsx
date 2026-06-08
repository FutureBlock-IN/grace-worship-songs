"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import type { FirebaseSong } from "@/types/firebase-song";

import { Button } from "@/components/ui/button";
import { AddMusicModal } from "@/components/admin/add-music-modal";
import { MusicList } from "@/components/admin/music-list";
import { getAllSongs } from "@/lib/firebase-queries";

export default function AdminPage() {
  const [songs, setSongs] = useState<FirebaseSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<FirebaseSong | null>(null);

  useEffect(() => {
    console.log("[AdminPage] Component mounted, loading songs");
    loadSongs();
  }, []);

  async function loadSongs() {
    try {
      console.log("[AdminPage] Loading songs from Firestore");
      setLoading(true);
      const data = await getAllSongs();
      console.log("[AdminPage] Songs loaded:", data.length);
      setSongs(data);
    } catch (error) {
      console.error("[AdminPage] Failed to load songs:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleAddMusic() {
    console.log("[AdminPage] Opening Add Music modal");
    setSelectedSong(null);
    setIsModalOpen(true);
  }

  function handleEditSong(song: FirebaseSong) {
    console.log("[AdminPage] Opening Edit modal for song:", song.id);
    setSelectedSong(song);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    console.log("[AdminPage] Closing modal");
    setIsModalOpen(false);
    setSelectedSong(null);
  }

  async function handleSongSaved() {
    console.log("[AdminPage] Song saved, closing modal and reloading");
    handleCloseModal();
    await loadSongs();
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
        onDelete={loadSongs}
      />
    </div>
  );
}
