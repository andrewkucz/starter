import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db/index";

export const getGenres = createServerFn({ method: "GET" }).handler(async () => {
  return db.query.genres.findMany({ orderBy: { name: "asc" } });
});
