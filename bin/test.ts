import { APP_NAME } from "@/components/brand";
import { ENV } from "varlock/env";

// run with the following to import and validate schema
// vpx --import varlock/auto-load ./bin/test.ts

console.log(`[${ENV.APP_ENV}] Hello from ${APP_NAME}`);
