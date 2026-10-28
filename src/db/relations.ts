import { defineRelations } from "drizzle-orm";
import { authRelations } from "./auth.schema";

import * as appSchema from "./app.schema";
import * as authSchema from "./auth.schema";

const appRelations = defineRelations({ ...appSchema, ...authSchema }, (r) => ({
  tasksTable: {
    user: r.one.user({
      from: r.tasksTable.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  user: {
    tasks: r.many.tasksTable({
      from: r.user.id,
      to: r.tasksTable.userId,
    }),
  },
}));

export const relations = { ...authRelations, ...appRelations };
