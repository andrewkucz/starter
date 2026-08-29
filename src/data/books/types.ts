import type { Genre } from "@/data/genres/types";

export type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  description: string;
  genre: Genre;
};
