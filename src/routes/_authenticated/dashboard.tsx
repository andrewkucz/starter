import { createFileRoute } from "@tanstack/react-router";

import { Dashboard } from "@/features/dashboard/pages/dashboard-page";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });
