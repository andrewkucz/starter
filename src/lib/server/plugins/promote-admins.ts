import { definePlugin } from "nitro";

import { promoteConfiguredAdminUsers } from "@/lib/auth/configured-admins";

// Grants the admin role to existing users listed in ADMIN_EMAILS. Registered after the migrate
// plugin, so the schema is current by the time this runs.
export default definePlugin(async () => {
  await promoteConfiguredAdminUsers();
});
