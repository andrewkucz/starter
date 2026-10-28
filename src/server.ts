import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { FastResponse } from "srvx";

import { promoteConfiguredAdminUsers } from "@/lib/auth/configured-admins";

// https://tanstack.com/start/latest/docs/framework/react/guide/hosting#performance-tip-fastresponsehttps://tanstack.com/start/latest/docs/framework/react/guide/hosting#performance-tip-fastresponse
globalThis.Response = FastResponse;

void promoteConfiguredAdminUsers();

export default {
  fetch: createStartHandler(defaultStreamHandler),
};
