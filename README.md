# Versume

Version your resume like code. A structured CV editor backed by GitHub — every save is a commit, every variant is a file, full history always available.

## Features

- **GitHub OAuth** — sign in with your GitHub account
- **Auto-creates `cv-store`** — a private repo in your GitHub where all CV data lives as JSON
- **Structured editor** — edit Personal, Experience, Projects, Education, Skills, and Languages
- **Live preview** — see your CV rendered in real time as you type
- **Version history** — every save is a GitHub commit; restore any past version
- **Multiple CVs** — create variants (e.g. `backend`, `fullstack`) each as a separate file
- **Draft persistence** — unsaved changes survive page refreshes via `localStorage`

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [NextAuth.js](https://next-auth.js.org) v4 — GitHub OAuth
- [Octokit](https://github.com/octokit/rest.js) — GitHub API
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)

## Getting Started

### 1. Create a GitHub OAuth App

Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**

| Field | Value |
|-------|-------|
| Homepage URL | `http://localhost:3000` |
| Authorization callback URL | `http://localhost:3000/api/auth/callback/github` |

### 2. Configure environment

```bash
cp .env.example .env.local
```

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
AUTH_SECRET=your_random_secret        # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run

```bash
npm install
npm run dev
```

## Data Structure

```
cv-store/           ← private GitHub repo auto-created on first login
└── cvs/
    ├── default.json
    ├── backend.json
    └── fullstack.json
```

## Deploy to Vercel

1. Push to GitHub and import into [Vercel](https://vercel.com)
2. Add env vars in Vercel project settings
3. Update OAuth App callback URL to `https://your-app.vercel.app/api/auth/callback/github`

## License

MIT
