import { drizzle } from "drizzle-orm/netlify-db";

import { relations } from "./schema.ts";

export const db = drizzle({ relations });
