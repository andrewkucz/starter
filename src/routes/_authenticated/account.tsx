import { createFileRoute } from "@tanstack/react-router";

import { SettingsAccount } from "@/features/settings/pages/account-page";

export const Route = createFileRoute("/_authenticated/account")({ component: SettingsAccount });
