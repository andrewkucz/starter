import { createFileRoute } from "@tanstack/react-router";

import { taskQueries } from "@/features/tasks/api";
import { TasksPage } from "@/features/tasks/pages/tasks-page";

export const Route = createFileRoute("/_authenticated/tasks")({
  loader: ({ context }) => context.queryClient.ensureQueryData(taskQueries.list),
  component: TasksPage,
});
