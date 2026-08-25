import { createFileRoute } from "@tanstack/react-router";
import { PageAccount } from "#/features/account/page-account";
export const Route = createFileRoute("/manager/account/")({ component: PageAccount });
