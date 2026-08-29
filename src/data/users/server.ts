import { createServerFn } from "@tanstack/react-start";

import type { User, UserSession } from "./types";

import { db } from "@/db/index";

function toUser(user: {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  onboarded_at: Date | null;
  sessions: Array<UserSession>;
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role === "admin" ? "admin" : "user",
    onboarded: user.onboarded_at != null,
    sessions: user.sessions,
  };
}

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const users = await db.query.user.findMany({
    with: { sessions: true },
    orderBy: { createdAt: "desc" },
  });

  return users.map(toUser);
});

export const getUser = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const user = await db.query.user.findFirst({
      where: { id: data.id },
      with: { sessions: { orderBy: { updatedAt: "desc" } } },
    });

    return user ? toUser(user) : null;
  });
