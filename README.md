# Baseline Missions

Terminal-native landing and onboarding flow for coding agents and their operators.

## Stack

- Astro 5
- TypeScript
- Tailwind CSS 4
- Astro Actions
- Astro DB
- `@astrojs/node` standalone adapter
- Dark-only route-based MPA

## Routes

- `/`
- `/start`
- `/probe`
- `/result`
- `/report`
- `/success`
- `/healthz`

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Build

Astro DB server builds need `ASTRO_DATABASE_FILE` defined.

```bash
npm run build
npm run start
```

The default build script uses `.astro/content.db` for the build step.
For runtime outside local dev, set a durable writable path, for example:

```bash
ASTRO_DATABASE_FILE=/data/baseline.db npm run start
```

## Docker

```bash
docker build -t baseline-missions .
docker run --rm -p 3000:3000 -e ASTRO_DATABASE_FILE=/data/baseline.db baseline-missions
```

## Persistence

Lead capture is stored through Astro DB using the schema in `db/config.ts`.

Stored fields:

- `id`
- `created_at`
- `email`
- `entry_mode`
- `runner`
- `primary_use_case`
- `primary_failure_mode`
- `strongest_area`
- `weakest_area`
- `recommended_mission`
- `readiness`
- `source`

## Deployment notes for current infra

The current k3s/Flux repo under `~/personal/standalone/infra` already has:

- `timequity` namespace
- GHCR pull secret in `kubernetes/apps/timequity/prod/secrets`
- NGINX ingress + cert-manager + external-dns
- ZITADEL running at `https://auth.10g.dev`

### What to add in infra repo for `getbaseline.run`

1. New app base + prod overlay under `kubernetes/apps/timequity/prod/baseline-missions`
2. HelmRelease pointing to the generic `kubernetes/charts/app`
3. Ingress host `getbaseline.run` with TLS via `cert-manager.io/cluster-issuer: letsencrypt`
4. Image repository `ghcr.io/timequity/baseline-missions`
5. Health probes on `/healthz`
6. A writable mount or PVC for `ASTRO_DATABASE_FILE=/data/baseline.db` (the runtime bootstrap copies the built Astro DB file there on first start)

### ZITADEL

ZITADEL is available in infra, but v1 intentionally does not implement auth.
If auth is added later, the pattern lives in `terraform/zitadel/envs/prod` using the reusable `modules/zitadel-oidc-app` module.

### Postgres

The cluster exposes shared Postgres, but Astro DB in this implementation runs against its own file-backed database path.
That keeps v1 aligned with the Astro DB requirement. If shared Postgres becomes mandatory later, that is a deliberate persistence-layer change rather than a small config tweak.
