import { boolean, index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

// Demo table: replace with your app's own schema.
export const tasksTable = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("tasks_user_id_idx").on(table.userId)],
);
