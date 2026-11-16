import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { FastResponse } from "srvx";

// https://tanstack.com/start/latest/docs/framework/react/guide/hosting#performance-tip-fastresponse
globalThis.Response = FastResponse;

export default {
  fetch: createStartHandler(defaultStreamHandler),
};
