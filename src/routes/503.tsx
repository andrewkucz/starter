import { createFileRoute } from "@tanstack/react-router";
import { MaintenanceError } from "@/features/errors/pages/maintenance-error-page";

export const Route = createFileRoute("/503")({ component: MaintenanceError });
