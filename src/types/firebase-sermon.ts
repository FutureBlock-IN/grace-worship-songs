export type FirebaseSermon = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  coverImage?: string;
  category: string;
  dateCreated: number;
  createdBy: string;
  isPublished: boolean;
};

export type CreateSermonInput = {
  title: string;
  subtitle?: string;
  description: string;
  coverImage?: string;
  category: string;
  createdBy: string;
  isPublished: boolean;
};

export type UpdateSermonInput = Partial<
  Omit<CreateSermonInput, "createdBy">
>;

export const SERMON_CATEGORIES = [
  "Wedding",
  "Baptism",
  "Funeral",
  "Communion",
  "Dedication",
  "Other",
] as const;

export type SermonCategory = (typeof SERMON_CATEGORIES)[number];
