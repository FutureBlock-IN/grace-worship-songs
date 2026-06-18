export type FirebaseCeremony = {
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

export type CreateCeremonyInput = {
  title: string;
  subtitle?: string;
  description: string;
  coverImage?: string;
  category: string;
  createdBy: string;
  isPublished: boolean;
};

export type UpdateCeremonyInput = Partial<
  Omit<CreateCeremonyInput, "createdBy">
>;

export const CEREMONY_CATEGORIES = [
  "Wedding",
  "Baptism",
  "Funeral",
  "Communion",
  "Dedication",
  "Other",
] as const;

export type CeremonyCategory = (typeof CEREMONY_CATEGORIES)[number];
