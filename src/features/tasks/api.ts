import { createQueryKeys } from "@lukemorales/query-key-factory";
import { mutationOptions, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { createTask, deleteTask, getTaskStats, listTasks, updateTask } from "./functions";
import type { CreateTaskInput, TaskIdInput, UpdateTaskInput } from "./schemas";

export const taskQueries = createQueryKeys("tasks", {
  list: {
    queryKey: null,
    queryFn: () => listTasks(),
  },
  stats: {
    queryKey: null,
    queryFn: () => getTaskStats(),
  },
});

export function useTaskMutations() {
  const queryClient = useQueryClient();
  const create = useServerFn(createTask);
  const update = useServerFn(updateTask);
  const remove = useServerFn(deleteTask);
  const onSettled = () => queryClient.invalidateQueries({ queryKey: taskQueries._def });

  return {
    create: mutationOptions({
      mutationKey: [...taskQueries._def, "create"],
      mutationFn: (input: CreateTaskInput) => create({ data: input }),
      onSettled,
    }),
    update: mutationOptions({
      mutationKey: [...taskQueries._def, "update"],
      mutationFn: (input: UpdateTaskInput) => update({ data: input }),
      onSettled,
    }),
    remove: mutationOptions({
      mutationKey: [...taskQueries._def, "remove"],
      mutationFn: (input: TaskIdInput) => remove({ data: input }),
      onSettled,
    }),
  };
}
