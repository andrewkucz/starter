# syntax=docker/dockerfile:1
# Config is resolved and encrypted with _VARLOCK_ENV_KEY at build time; images need only the key at runtime.

FROM node:24-slim AS base
RUN npm install --global pnpm@11.22.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS build
COPY . .
RUN --mount=type=secret,id=build_env,target=/app/config/env/.env,required=true \
  --mount=type=secret,id=varlock_key,env=_VARLOCK_ENV_KEY,required=true \
  export APP_ENV=production \
  && node_modules/.bin/vp run build \
  && node_modules/.bin/varlock freeze

# drizzle-kit is a devDependency, so this builds on the full install.
FROM deps AS migrate
ENV NODE_ENV=production _VARLOCK_USE_FROZEN_ENV=1
COPY --chown=node:node package.json ./
# Written with mode 0600, so it must be owned by the runtime user.
COPY --chown=node:node --from=build /app/.varlock-frozen-env ./
COPY --chown=node:node config/drizzle.config.ts config/drizzle.config.ts
COPY --chown=node:node config/migrations config/migrations
USER node
CMD ["node_modules/.bin/drizzle-kit", "migrate", "--config", "config/drizzle.config.ts"]

FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node --from=build /app/.output .output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
