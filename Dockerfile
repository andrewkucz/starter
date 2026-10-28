# Varlock validates config at build and resolves it again at startup.

FROM node:24-slim AS base
RUN npm install --global pnpm@11.22.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS build
COPY . .
# Mount deployment credentials only for this step; the env file is not stored in a layer.
# Config is dynamic (except `@static` items such as VITE_APP_VERSION), and the SSR build uses
# init-only injection.
RUN --mount=type=secret,id=build_env,target=/app/config/env/.env,required=true \
  APP_ENV=production node_modules/.bin/vp run build

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# One-shot migration runner for the `migrate` service in docker-compose.yml. drizzle-kit is a
# devDependency, so this uses the full install; drizzle.config.ts resolves env via varlock.
FROM deps AS migrate
ENV NODE_ENV=production APP_ENV=production
COPY --chown=node:node package.json ./
COPY --chown=node:node config/env/.env.schema config/env/.env.production config/env/
COPY --chown=node:node src/env.d.ts src/env.d.ts
COPY --chown=node:node config/drizzle.config.ts config/drizzle.config.ts
COPY --chown=node:node config/migrations config/migrations
USER node
CMD ["node_modules/.bin/drizzle-kit", "migrate", "--config", "config/drizzle.config.ts"]

FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production APP_ENV=production
COPY --chown=node:node --from=prod-deps /app/node_modules node_modules
COPY --chown=node:node --from=build /app/.output .output
# Varlock skips rewriting unchanged types; include the generated file for runtime loads.
COPY --chown=node:node --from=build /app/src/env.d.ts src/env.d.ts
COPY --chown=node:node package.json ./
COPY --chown=node:node config/env/.env.schema config/env/.env.production config/env/
USER node
EXPOSE 3000
# Web server; `varlock run` resolves env before any SSR chunk evaluates.
CMD ["node_modules/.bin/varlock", "run", "--", "node", ".output/server/index.mjs"]
