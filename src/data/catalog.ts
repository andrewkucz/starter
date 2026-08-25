export type Genre = {
  id: string;
  name: string;
  color: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedAt: string;
  description: string;
  genre: Genre;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  onboarded: boolean;
};

export const genres: Array<Genre> = [
  { id: "fiction", name: "Fiction", color: "#b45353" },
  { id: "history", name: "History", color: "#3f6b76" },
  { id: "science", name: "Science", color: "#4d7257" },
  { id: "design", name: "Design", color: "#8a6a3c" },
];

export const books: Array<Book> = [
  {
    id: "the-long-way-home",
    title: "The Long Way Home",
    author: "Maya Hart",
    publisher: "North & Pine",
    publishedAt: "2025",
    description:
      "A quiet, luminous novel about memory, distance, and the places that keep calling us back.",
    genre: genres[0],
  },
  {
    id: "small-atlas-of-clouds",
    title: "A Small Atlas of Clouds",
    author: "Jon Bell",
    publisher: "Field Notes Press",
    publishedAt: "2024",
    description:
      "An illustrated guide to reading the sky and noticing the weather moving around us.",
    genre: genres[2],
  },
  {
    id: "objects-and-meaning",
    title: "Objects & Meaning",
    author: "Ada Monroe",
    publisher: "Workshop Editions",
    publishedAt: "2026",
    description: "Essays on why the everyday objects we design become part of the stories we tell.",
    genre: genres[3],
  },
  {
    id: "after-the-river",
    title: "After the River",
    author: "Noah Okafor",
    publisher: "Common Ground",
    publishedAt: "2023",
    description: "A social history of the towns shaped by one river over the course of a century.",
    genre: genres[1],
  },
  {
    id: "night-gardens",
    title: "Night Gardens",
    author: "Sofia Vale",
    publisher: "North & Pine",
    publishedAt: "2026",
    description:
      "A dreamlike collection of short stories rooted in gardens that only bloom after dark.",
    genre: genres[0],
  },
  {
    id: "useful-edges",
    title: "Useful Edges",
    author: "Iris Chen",
    publisher: "Workshop Editions",
    publishedAt: "2025",
    description:
      "A practical field guide to designing interfaces with clarity, restraint, and care.",
    genre: genres[3],
  },
];

export const users: Array<User> = [
  {
    id: "mia-bennett",
    name: "Mia Bennett",
    email: "mia@example.com",
    role: "admin",
    onboarded: true,
  },
  {
    id: "oliver-chen",
    name: "Oliver Chen",
    email: "oliver@example.com",
    role: "user",
    onboarded: true,
  },
  { id: "nora-kim", name: "Nora Kim", email: "nora@example.com", role: "user", onboarded: false },
  {
    id: "sam-rivera",
    name: "Sam Rivera",
    email: "sam@example.com",
    role: "admin",
    onboarded: true,
  },
];

export function getBook(id: string) {
  return books.find((book) => book.id === id);
}

export function getUser(id: string) {
  return users.find((user) => user.id === id);
}
