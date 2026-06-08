export type FirebaseSong = {
  id: string;
  title: string;
  lyrics: string;
  transliteratedLyrics?: string;
  imageUrl?: string;
  audioUrl?: string;
  youtubeUrl?: string;
  createdAt: number;
};

export type CreateSongInput = {
  title: string;
  lyrics: string;
  transliteratedLyrics?: string;
  imageUrl?: string;
  audioUrl?: string;
  youtubeUrl?: string;
};

export type UpdateSongInput = Partial<CreateSongInput>;
