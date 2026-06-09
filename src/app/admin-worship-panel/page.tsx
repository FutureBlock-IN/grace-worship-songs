// "use client";

// import React, { useEffect, useState } from "react";
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

// import type { FirebaseSong } from "@/types/firebase-song";

// import { Button } from "@/components/ui/button";
// import { AddMusicModal } from "@/components/admin/add-music-modal";
// import { MusicList } from "@/components/admin/music-list";
// import { db } from "@/lib/firebase";

// export default function AdminPage() {
//   const [songs, setSongs] = useState<FirebaseSong[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSong, setSelectedSong] = useState<FirebaseSong | null>(null);

//   useEffect(() => {
//     const songsQuery = query(
//       collection(db, "songs"),
//       orderBy("createdAt", "desc")
//     );

//     const unsubscribe = onSnapshot(
//       songsQuery,
//       (snapshot) => {
//         setSongs(
//           snapshot.docs.map((doc) => ({
//             id: doc.id,
//             title: String(doc.data().title ?? ""),
//             lyrics: String(doc.data().lyrics ?? doc.data().teluguLyrics ?? ""),
//             transliteratedLyrics: String(
//               doc.data().transliteratedLyrics ?? doc.data().englishLyrics ?? ""
//             ),
//             imageUrl: String(doc.data().imageUrl ?? doc.data().coverImageUrl ?? "") || undefined,
//             audioUrl: String(doc.data().audioUrl ?? doc.data().audioFileUrl ?? "") || undefined,
//             createdAt:
//               typeof doc.data().createdAt === "object" &&
//               doc.data().createdAt !== null &&
//               typeof (doc.data().createdAt as { toMillis(): number }).toMillis === "function"
//                 ? (doc.data().createdAt as { toMillis(): number }).toMillis()
//                 : Date.now(),
//           }))
//         );
//         setLoading(false);
//       },
//       (error) => {
//         console.error("[AdminPage] Firestore snapshot failed:", error);
//         toast.error("Unable to sync songs in real time");
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   function handleAddMusic() {
//     setSelectedSong(null);
//     setIsModalOpen(true);
//   }

//   function handleEditSong(song: FirebaseSong) {
//     setSelectedSong(song);
//     setIsModalOpen(true);
//   }

//   function handleCloseModal() {
//     setIsModalOpen(false);
//     setSelectedSong(null);
//   }

//   function handleSongSaved() {
//     handleCloseModal();
//   }

//   return (
//     <div className="container space-y-6 py-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-4xl font-bold tracking-tight">Music Admin</h1>
//           <p className="mt-2 text-muted-foreground">
//             Manage songs, uploads, and lyrics
//           </p>
//         </div>

//         <Button size="lg" onClick={handleAddMusic} className="gap-2">
//           <Plus className="h-5 w-5" />
//           Add Music
//         </Button>
//       </div>

//       <AddMusicModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSave={handleSongSaved}
//         initialSong={selectedSong}
//       />

//       <MusicList
//         songs={songs}
//         loading={loading}
//         onEdit={handleEditSong}
//         onDelete={() => {
//           /* Real-time snapshot keeps songs current */
//         }}
//       />
//     </div>
//   );
// }

// Calude code
"use client";

import React, { useEffect, useState } from "react";
import { Plus, Music2, ListMusic, UploadCloud } from "lucide-react";
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
            imageUrl:
              String(doc.data().imageUrl ?? doc.data().coverImageUrl ?? "") ||
              undefined,
            audioUrl:
              String(doc.data().audioUrl ?? doc.data().audioFileUrl ?? "") ||
              undefined,
            createdAt:
              typeof doc.data().createdAt === "object" &&
              doc.data().createdAt !== null &&
              typeof (
                doc.data().createdAt as { toMillis(): number }
              ).toMillis === "function"
                ? (
                    doc.data().createdAt as { toMillis(): number }
                  ).toMillis()
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

  const withAudio = songs.filter((s) => s.audioUrl).length;
  const withLyrics = songs.filter((s) => s.lyrics?.trim()).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">

      {/* ── Page header ── */}
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
                Music Admin
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage songs, uploads, and lyrics
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleAddMusic}
            className="gap-2 rounded-full px-5 font-semibold shadow"
          >
            <Plus className="h-4 w-4" />
            Add Song
          </Button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            icon: <ListMusic className="h-4 w-4" />,
            label: "Total Songs",
            value: loading ? "—" : songs.length,
          },
          {
            icon: <UploadCloud className="h-4 w-4" />,
            label: "With Audio",
            value: loading ? "—" : withAudio,
          },
          {
            icon: <Music2 className="h-4 w-4" />,
            label: "With Lyrics",
            value: loading ? "—" : withLyrics,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card px-4 py-4 shadow-sm"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {stat.icon}
            </div>
            <p className="font-heading text-xl font-bold sm:text-2xl">
              {stat.value}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Song list ── */}
      <MusicList
        songs={songs}
        loading={loading}
        onEdit={handleEditSong}
        onDelete={() => {}}
      />

      <AddMusicModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCloseModal}
        initialSong={selectedSong}
      />
    </div>
  );
}