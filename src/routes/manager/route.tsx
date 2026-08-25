import { createFileRoute } from "@tanstack/react-router";
import { ManagerShell } from "#/components/layout/manager-shell";
export const Route = createFileRoute("/manager")({ component: ManagerShell });
