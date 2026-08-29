import { count, isNotNull } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db/index";
import { books, user } from "@/db/schema";

export const getDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const [bookCountRows, userCountRows, onboardedCountRows, recentBooks] = await Promise.all([
    db.select({ value: count() }).from(books),
    db.select({ value: count() }).from(user),
    db.select({ value: count() }).from(user).where(isNotNull(user.onboarded_at)),
    db.query.books.findMany({
      columns: {
        genreId: false,
        createdAt: false,
      },
      with: { genre: true },
      orderBy: { createdAt: "desc" },
      limit: 4,
    }),
  ]);

  return {
    bookCount: bookCountRows[0]?.value ?? 0,
    userCount: userCountRows[0]?.value ?? 0,
    onboardedCount: onboardedCountRows[0]?.value ?? 0,
    recentBooks,
  };
});
