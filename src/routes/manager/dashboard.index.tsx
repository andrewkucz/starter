import { createFileRoute } from "@tanstack/react-router";
import { PageDashboard } from "#/features/manager/page-dashboard";
export const Route = createFileRoute("/manager/dashboard/")({ component: PageDashboard });
