# Versume — Claude Context

## Project

Next.js 16 (App Router) CV editor. Users sign in with GitHub OAuth, their CV data is stored as JSON files in a private `cv-store` GitHub repo. Every save is a git commit.

## Key Files

- `src/lib/auth.ts` — NextAuth v4 config, exposes `auth()` for server components
- `src/lib/github.ts` — all GitHub API calls via Octokit (repo creation, file CRUD, history)
- `src/lib/default-cv.ts` — `MIKHEIL_CV` seed data + `createEmptyCV()` factory
- `src/types/cv.ts` — the full `CV` type definition
- `src/app/editor/page.tsx` — server component, loads CV from GitHub, passes to client
- `src/components/CVEditor.tsx` — main client editor (tabs, draft persistence, save dialog)
- `src/components/CVSidebar.tsx` — CV list, create/delete CVs
- `src/components/preview/CVPreview.tsx` — live CV render (white page style)

## Architecture Notes

- Auth uses `session.githubLogin` (not `session.user.name`) for the GitHub username — `user.name` is the display name
- All GitHub API calls use `.catch(() => null)` pattern to avoid Next.js dev logging 404s
- Drafts are stored in `localStorage` under key `cv-draft:{cvName}`, cleared on GitHub save
- The `cv-store` repo is auto-created on first login with `auto_init: true`

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npx tsc --noEmit # type check
```

## Env Vars Required

```
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
AUTH_SECRET
NEXTAUTH_URL
```
