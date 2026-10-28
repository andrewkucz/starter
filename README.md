# Acme

<!-- init:start -->

## Getting started from this template

This repo uses `Acme` / `acme` as placeholder names. Before doing anything else, run:

```sh
bin/init.sh
```

It asks for your application name and slug, replaces every placeholder in the repo, removes this section, and deletes itself.

<!-- init:end -->

A full-stack TypeScript web app built on TanStack Start (React 19, Router, Query, Form, Table), with Better Auth for authentication, Drizzle ORM on Postgres, Tailwind CSS, and Varlock for environment config. Tooling runs through [Vite+](https://viteplus.dev) (`vp`).

## Development

```sh
vp install            # install dependencies
vp run services:up    # start local Postgres
vp run db:migrate     # apply migrations
vp dev                # start the dev server
```

Run `vp check` and `vp test` before committing.

## Deployment

`docker-compose.yml` targets Dokploy (Docker Compose):

- Set `INFISICAL_PROJECT_ID`, `INFISICAL_CLIENT_ID`, `INFISICAL_CLIENT_SECRET` (identity with access to Infisical `prod`), `POSTGRES_PASSWORD` and `_VARLOCK_ENV_KEY` (`varlock generate-key --plain`) in the deploy environment.
- Route the domain to `web` on port 3000 and keep `BETTER_AUTH_URL` in `config/env/.env.production` in sync.
- Config is resolved and encrypted during the image build, so secret changes take effect on redeploy, not restart.
- Services share a project-scoped network and reach Postgres via a unique alias, so they don't clash with other projects on Dokploy's shared `dokploy-network`. Enable "Isolated Deployment" where available.

## Layout

- `src/routes` – file-based routes
- `src/features` – feature modules (auth, dashboard, settings, tasks, users)
- `src/components` – shared UI
- `src/db` – Drizzle schemas
- `src/lib` – auth and server utilities
- `config` – env, Drizzle, Docker Compose, and Knip config
- `bin` – project scripts
