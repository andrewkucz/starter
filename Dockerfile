# syntax=docker/dockerfile:1
# Config is resolved and encrypted at build time, so the runtime image needs only VARLOCK_ENV_KEY.

FROM node:24-slim AS base
RUN npm install --global pnpm@11.22.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS build
ENV APP_ENV=production
ARG VITE_PUBLIC_URL
COPY . .
RUN --mount=type=secret,id=infisical_client_id,env=INFISICAL_CLIENT_ID,required=true \
  --mount=type=secret,id=infisical_client_secret,env=INFISICAL_CLIENT_SECRET,required=true \
  --mount=type=secret,id=postgres_password,env=POSTGRES_PASSWORD,required=true \
  --mount=type=secret,id=varlock_key,env=_VARLOCK_ENV_KEY,required=true \
  pnpm run build

FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node --from=build /app/.output .output
COPY --chown=node:node config/migrations config/migrations
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
