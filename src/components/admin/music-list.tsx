"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { FirebaseSong } from "@/types/firebase-song";
import { DEFAULT_SONG_COVER } from "@/config/site";
import { getSongCoverUrl } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteSong } from "@/lib/firebase-queries";

type MusicListProps = {
  songs: FirebaseSong[];
  loading: boolean;
  onEdit: (song: FirebaseSong) => void;
  onDelete: () => void;
};

export function MusicList({
  songs,
  loading,
  onEdit,
  onDelete,
}: MusicListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<FirebaseSong | null>(null);

  function handleDeleteClick(song: FirebaseSong) {
    setSelectedSong(song);
    setDeleteConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!selectedSong) return;

    setDeleting(selectedSong.id);
    try {
      await deleteSong(selectedSong.id);
      toast.success("Song deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error("Failed to delete song");
    } finally {
      setDeleting(null);
      setDeleteConfirmOpen(false);
      setSelectedSong(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No songs yet. Add your first song!</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.map((song) => (
              <TableRow key={song.id}>
                <TableCell>
                  <img
                    src={getSongCoverUrl(song.imageUrl)}
                    alt={song.title}
                    className="h-10 w-10 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_SONG_COVER;
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{song.title}</TableCell>
                <TableCell>
                  {new Date(song.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(song)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(song)}
                      disabled={deleting === song.id}
                      className="gap-2"
                    >
                      {deleting === song.id ?
                        <Loader2 className="h-4 w-4 animate-spin" />
                      : <Trash2 className="h-4 w-4" />}
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Song?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedSong?.title}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
