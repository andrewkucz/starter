import { createFileRoute } from "@tanstack/react-router";
import { getDashboard } from "@/data/dashboard/server";
import { PageDashboard } from "@/features/manager/page-dashboard";
export const Route = createFileRoute("/manager/dashboard/")({
  loader: () => getDashboard(),
  component: RouteComponent,
});

function RouteComponent() {
  return <PageDashboard {...Route.useLoaderData()} />;
}
