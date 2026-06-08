"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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
    loadSongs();
  }, []);

  async function loadSongs() {
    try {
      setLoading(true);
      const data = await getAllSongs();
      setSongs(data);
    } catch (error) {
      console.error("Failed to load songs:", error);
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  }

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

  async function handleSongSaved() {
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
