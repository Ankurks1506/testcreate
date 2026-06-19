# Deploying PrepRoute on Vercel

## Prerequisites

- A [Vercel](https://vercel.com) account
- The project pushed to a GitHub, GitLab, or Bitbucket repository

## Steps

### 1. Configure API Base URL

The Vite dev server proxy (`vite.config.ts`) does **not** work in production. The app must know the production API URL at build time.

**Option A — Using Vite env variable (recommended)**

Create `.env.production` in the project root:

```
VITE_API_BASE=https://admin-moderator-backend-staging.up.railway.app
```

Then update `src/api/client.ts` to use it:

```ts
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  headers: { 'Content-Type': 'application/json' },
});
```

**Option B — Using Vercel rewrites (no code change)**

Create `vercel.json` in the project root:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://admin-moderator-backend-staging.up.railway.app/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This proxies `/api/*` requests to the backend and serves `index.html` for all other paths (needed because Vite builds a SPA).

### 2. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from the project root
vercel

# Follow prompts — Vercel auto-detects Vite
```

### 3. Deploy via Git Import

1. Push your repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Vercel auto-detects:
   - **Framework**: Vite
   - **Build Command**: `npm run build` (or `tsc -b && vite build`)
   - **Output Directory**: `dist`
5. Add environment variables if using Option A (e.g., `VITE_API_BASE`).
6. Click **Deploy**.

### 4. Post-Deployment

- If using Option B (rewrites), Vercel will automatically create a `vercel.json` in your project — make sure it's committed.
- If the API is on a different domain, ensure the backend allows CORS from your Vercel domain. Add your Vercel URL to the backend's allowed origins.

## Troubleshooting

| Symptom                          | Likely cause                                      |
| -------------------------------- | ------------------------------------------------- |
| API calls fail with 404          | No rewrite rule — `/api/*` isn't proxied          |
| Blank page / 404 on refresh      | Missing SPA fallback rewrite                      |
| CORS errors in browser           | Backend doesn't allow your Vercel domain          |
| 401 after login on fresh deploy  | `localStorage` is cleared; log in again           |

## Production Checklist

- [ ] API base URL points to the production (not staging) backend
- [ ] CORS headers on backend include your Vercel domain
- [ ] `vercel.json` committed with SPA fallback (`/index.html`)
- [ ] Environment variables configured in Vercel dashboard (if using env-based API URL)
- [ ] Test a full flow: login → create test → add questions → publish
