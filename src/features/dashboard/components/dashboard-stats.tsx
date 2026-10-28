import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CircleCheck, CircleDashed, ListTodo } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { taskQueries } from "@/features/tasks/api";

const stats = [
  { key: "total", label: "Tasks", Icon: ListTodo },
  { key: "open", label: "Open", Icon: CircleDashed },
  { key: "completed", label: "Completed", Icon: CircleCheck },
] as const;

export function DashboardStats() {
  const {
    isPending: statsIsPending,
    isError: statsIsError,
    data: statsData,
  } = useQuery({
    ...taskQueries.stats,
    enabled: typeof window !== "undefined",
  });

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ key, label, Icon }) => (
        <Link
          key={key}
          to="/tasks"
          className="rounded-xl text-foreground no-underline outline-none transition-shadow hover:ring-2 hover:ring-ring/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsIsPending ? (
                <Skeleton className="h-8 w-16" />
              ) : statsIsError ? (
                <p className="text-sm text-destructive">Unavailable</p>
              ) : (
                <div className="text-2xl font-bold tabular-nums">
                  {statsData[key].toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
