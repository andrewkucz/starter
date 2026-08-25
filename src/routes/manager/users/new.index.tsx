import { createFileRoute } from "@tanstack/react-router";
import { FormUserPage } from "#/features/manager/form-user-page";
export const Route = createFileRoute("/manager/users/new/")({ component: FormUserPage });
