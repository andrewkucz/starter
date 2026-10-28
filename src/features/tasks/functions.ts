import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "@/lib/auth/middleware";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "./schemas";
import {
  createTask as insertTask,
  deleteTask as removeTask,
  getTaskStats as queryTaskStats,
  listTasks as queryTasks,
  updateTask as patchTask,
} from "./server";

export const listTasks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context: { session } }) => queryTasks(session.user.id));

export const getTaskStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context: { session } }) => queryTaskStats(session.user.id));

export const createTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(createTaskSchema)
  .handler(({ data, context: { session } }) => insertTask(session.user.id, data));

export const updateTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(updateTaskSchema)
  .handler(({ data, context: { session } }) => patchTask(session.user.id, data));

export const deleteTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(taskIdSchema)
  .handler(({ data, context: { session } }) => removeTask(session.user.id, data.id));

export type Task = Awaited<ReturnType<typeof listTasks>>[number];
