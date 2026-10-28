import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./server-client";

export const getSession = createServerFn({ method: "GET" }).handler(() => {
  return auth.api.getSession({ headers: getRequestHeaders() });
});
