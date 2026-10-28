import { and, count, desc, eq } from "drizzle-orm";

import { db, tasksTable } from "@/db";
import { AppError } from "@/lib/server/app-error";
import type { CreateTaskInput, UpdateTaskInput } from "./schemas";

export function listTasks(userId: string) {
  return db
    .select({
      id: tasksTable.id,
      title: tasksTable.title,
      completed: tasksTable.completed,
      createdAt: tasksTable.createdAt,
    })
    .from(tasksTable)
    .where(eq(tasksTable.userId, userId))
    .orderBy(desc(tasksTable.createdAt));
}

export async function getTaskStats(userId: string) {
  const rows = await db
    .select({ completed: tasksTable.completed, count: count() })
    .from(tasksTable)
    .where(eq(tasksTable.userId, userId))
    .groupBy(tasksTable.completed);

  const completed = rows.find((row) => row.completed)?.count ?? 0;
  const open = rows.find((row) => !row.completed)?.count ?? 0;

  return { total: completed + open, open, completed };
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const [task] = await db
    .insert(tasksTable)
    .values({ userId, title: input.title })
    .returning({ id: tasksTable.id });

  return task;
}

export async function updateTask(userId: string, { id, ...changes }: UpdateTaskInput) {
  const [task] = await db
    .update(tasksTable)
    .set(changes)
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
    .returning({ id: tasksTable.id });

  if (!task) throw new AppError({ code: "NOT_FOUND", message: "Task not found." });

  return task;
}

export async function deleteTask(userId: string, id: number) {
  const [task] = await db
    .delete(tasksTable)
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
    .returning({ id: tasksTable.id });

  if (!task) throw new AppError({ code: "NOT_FOUND", message: "Task not found." });

  return { success: true };
}
