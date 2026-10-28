import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { TaskCreateForm } from "../components/task-create-form";
import { TasksGrid } from "../components/tasks-grid";

export function TasksPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Tasks</PageTitle>
      </PageHeader>
      <PageContent className="gap-4 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A demo feature backed by the <code>tasks</code> table. Click a cell to edit it.
          </p>
        </div>
        <TaskCreateForm />
        <TasksGrid />
      </PageContent>
    </Page>
  );
}
