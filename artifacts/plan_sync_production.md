# Plan - Sync Production

The goal is to synchronize the `main` branch with the `master` branch (which is the default branch for the live site) and push the updates to GitHub. This will trigger a redeploy on the live site (likely Vercel).

## Goals
- Sync `main` into `master`.
- Resolve any potential conflicts.
- Verify the build passes the "Definition of Done".
- Push all changes to `origin/master` and `origin/main`.

## Affected Branches
- `main`: Source of truth for new features.
- `master`: Target branch for production deployment.

## Risks
- Build failure on the live site due to environment differences.
- Unexpected UI regressions.

## Test Strategy
- `pnpm typecheck`: Ensure types are consistent.
- `pnpm lint`: Ensure linting rules are followed.
- `pnpm build`: Ensure production build succeeds.
- Manual verification in the built-in browser.
