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

## Layout

- `src/routes` – file-based routes
- `src/features` – feature modules (auth, dashboard, settings, tasks, users)
- `src/components` – shared UI
- `src/db` – Drizzle schemas
- `src/lib` – auth and server utilities
- `config` – env, Drizzle, Docker Compose, and Knip config
- `bin` – project scripts
