# Deploying PrepRoute on Vercel

## Prerequisites

- A [Vercel](https://vercel.com) account
- The project pushed to a GitHub, GitLab, or Bitbucket repository

## Steps

### 1. Create `vercel.json` for API proxying

Create `vercel.json` in the project root:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://admin-moderator-backend-staging.up.railway.app/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This proxies `/api/*` requests to the backend server-side (no CORS issues) and serves `index.html` for all other paths (SPA fallback).

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
 5. Click **Deploy**.

### 4. Post-Deployment

- Vercel automatically detects `vercel.json` — ensure it's committed.
- No CORS configuration needed — all API requests stay same-origin through the Vercel proxy.

## Troubleshooting

| Symptom                          | Likely cause                                      |
| -------------------------------- | ------------------------------------------------- |
| API calls fail with 404          | No rewrite rule — `/api/*` isn't proxied          |
| Blank page / 404 on refresh      | Missing SPA fallback rewrite                      |
| CORS errors in browser           | `baseURL` is set to a full URL instead of `/api` — check client.ts |
| 401 after login on fresh deploy  | `localStorage` is cleared; log in again           |

## Production Checklist

- [ ] API base URL points to the production (not staging) backend
- [ ] `vercel.json` committed with SPA fallback (`/index.html`)
- [ ] No `VITE_API_BASE` env var set in Vercel dashboard (would bypass the proxy)
- [ ] Test a full flow: login → create test → add questions → publish
