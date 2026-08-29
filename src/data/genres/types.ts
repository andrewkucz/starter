import type { genres } from "@/db/schema";

export type Genre = typeof genres.$inferSelect;
