# Branch strategy

Monorepo: `stwmovers-backend/` and `stwmovers-frontend/` in one GitHub repository.

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Deploys to Hostinger VPS via GitHub Actions. |
| `feature/*` | Short-lived work branches. Open PR into `main`. |

Legacy branches `cursor/taxi-booking-backend` and `cursor/taxi-booking-frontend` are retired after merge into `main`.

## CI/CD (GitHub Actions — free tier)

| Workflow | Triggers when | Job |
|----------|---------------|-----|
| `backend-ci.yml` | Changes under `stwmovers-backend/` | Maven test + JAR build |
| `frontend-ci.yml` | Changes under `stwmovers-frontend/` | Typecheck; on `main`, production build + upload artifact |
| `backend-deploy.yml` | After successful Backend CI on `main` | SSH JAR to VPS + systemd restart |
| `frontend-deploy.yml` | After successful Frontend CI on `main` | Download CI artifact, rsync `.output` to VPS + systemd restart |

Path filters keep backend and frontend pipelines independent: a frontend-only push does not run backend tests.

## GitHub environments

Create a **production** environment in the repo settings and add secrets there before enabling auto-deploy.
