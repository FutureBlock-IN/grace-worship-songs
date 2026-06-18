export type FirebaseArticle = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  coverImage?: string;
  author: string;
  authorImage?: string;
  tags: string[];
  dateCreated: number;
  createdBy: string;
  isPublished: boolean;
};

export type CreateArticleInput = {
  title: string;
  shortDescription: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  createdBy: string;
  isPublished: boolean;
};

export type UpdateArticleInput = Partial<
  Omit<CreateArticleInput, "createdBy">
>;
