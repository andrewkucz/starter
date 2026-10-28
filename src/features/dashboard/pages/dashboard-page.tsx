import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { DashboardStats } from "../components/dashboard-stats";

export function Dashboard() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
      </PageHeader>
      <PageContent width="wide" className="gap-4 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">An overview of your activity.</p>
        </div>
        <DashboardStats />
      </PageContent>
    </Page>
  );
}
