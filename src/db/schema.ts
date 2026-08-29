import { defineRelations } from "drizzle-orm";

import * as appSchema from "./app.schema.ts";
import * as authSchema from "./auth.schema.ts";

export * from "./app.schema.ts";
export * from "./auth.schema.ts";

const schema = { ...authSchema, ...appSchema };

export const relations = defineRelations(schema, (r) => ({
  genres: {
    books: r.many.books(),
  },
  books: {
    genre: r.one.genres({
      from: r.books.genreId,
      to: r.genres.id,
      optional: false,
    }),
  },
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
      optional: false,
    }),
  },
}));
