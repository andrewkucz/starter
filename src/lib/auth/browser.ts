import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, roles } from "@/lib/auth/permissions";
import type { auth } from "@/lib/auth/server-client";

const authClient = createAuthClient({
  plugins: [adminClient({ ac, roles }), inferAdditionalFields<typeof auth>()],
});

export { authClient };
