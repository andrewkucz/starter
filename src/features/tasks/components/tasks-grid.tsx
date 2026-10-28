import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ListTodo, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { taskQueries, useTaskMutations } from "../api";
import type { Task } from "../functions";
import { createTaskSchema } from "../schemas";

export function TasksGrid() {
  const { data: tasks, isPending, isError, error } = useQuery(taskQueries.list);
  const mutations = useTaskMutations();
  const { mutate: updateMutate } = useMutation(mutations.update);
  const { mutate: removeMutate, isPending: removeIsPending } = useMutation({
    ...mutations.remove,
    onSuccess: () => setTaskToDelete(null),
  });
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const columns: DataGridColumn<Task>[] = [
    {
      key: "completed",
      title: "Done",
      width: 72,
      align: "center",
      editor: "checkbox",
      sortable: true,
      onValueChange: (task, value) => {
        updateMutate({ id: task.id, completed: Boolean(value) });
        return true;
      },
    },
    {
      key: "title",
      title: "Title",
      width: 420,
      searchable: true,
      sortable: true,
      editor: "text",
      onValueChange: (task, value) => {
        const parsed = createTaskSchema.shape.title.safeParse(value);
        if (!parsed.success) return false;
        updateMutate({ id: task.id, title: parsed.data });
        return true;
      },
    },
    {
      key: "createdAt",
      title: "Created",
      width: 160,
      sortable: true,
      render: (value) => format(new Date(value as Date), "PP"),
    },
    {
      key: "id",
      title: "",
      width: 56,
      align: "end",
      sticky: "end",
      readOnly: true,
      render: (_value, task) => (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete “${task.title}”`}
          onClick={(event) => {
            event.stopPropagation();
            setTaskToDelete(task);
          }}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      ),
    },
  ];

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    );
  }

  if (isError || tasks.length === 0) {
    return (
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListTodo aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{isError ? "Unable to load tasks" : "No tasks yet"}</EmptyTitle>
              <EmptyDescription>
                {isError ? error.message : "Add your first task above to get started."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <DataGrid
        columns={columns}
        data={tasks}
        getRowId={(task) => String(task.id)}
        emptyMessage="No tasks match your search."
      />
      <ConfirmDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
        title="Delete task"
        desc={`“${taskToDelete?.title ?? ""}” will be permanently deleted.`}
        confirmText="Delete"
        destructive
        isLoading={removeIsPending}
        handleConfirm={() => taskToDelete && removeMutate({ id: taskToDelete.id })}
      />
    </>
  );
}
