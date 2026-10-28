import { z } from "zod";

export const MAX_TASK_TITLE_LENGTH = 200;

const taskTitleSchema = z
  .string()
  .trim()
  .min(1, "Enter a title.")
  .max(MAX_TASK_TITLE_LENGTH, `Title must be ${MAX_TASK_TITLE_LENGTH} characters or less.`);

export const createTaskSchema = z.object({ title: taskTitleSchema });

export const updateTaskSchema = z.object({
  id: z.number().int().positive(),
  title: taskTitleSchema.optional(),
  completed: z.boolean().optional(),
});

export const taskIdSchema = z.object({ id: z.number().int().positive() });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type TaskIdInput = z.infer<typeof taskIdSchema>;
