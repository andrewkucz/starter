import { APP_NAME } from "@/components/brand";
import { ENV } from "varlock/env";

// Run with: vpx --import varlock/auto-load ./bin/test.ts

console.log(`[${ENV.APP_ENV}] Hello from ${APP_NAME}`);
