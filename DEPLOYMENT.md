# Deployment checklist

## Before deploying

1. Configure the production environment variables below in the hosting dashboard. Do not upload a `.env` file.
2. Create a production MySQL database and allow the backend host to connect to it.
3. Run migrations against that production database before sending users to the site. The backend `prestart` script runs them automatically whenever Hostinger starts it with `npm start`.
4. Create a real admin account, then grant it admin access in the production database. Do not use a sample user's credentials.

## Render

Deploy the backend as a **Web Service** with:

- Root directory: `Firstshadi-backend`
- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/api/health`
- Environment: copy the keys from `Firstshadi-backend/.env.example` into Render's Environment settings. Render supplies `PORT` automatically.
- Persistent disk: mount at `/var/data`; set `UPLOAD_DIR=/var/data/uploads`.

The `prestart` script runs `npm run migrate` automatically when the service launches with `npm start`.

Deploy the frontend as a **Static Site** with:

- Root directory: repository root
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Build environment variable: `VITE_API_URL=https://<backend-service>.onrender.com/api`
- Rewrite rule: `/*` to `/index.html` with status `200` for React Router routes.

After the frontend has a URL, set the backend's `FRONTEND_URL` to that exact origin (scheme and hostname, no path), then redeploy the backend.

## Hostinger

Use a plan that supports Node.js applications, or a VPS. Deploy the backend from `Firstshadi-backend` with `npm install` and `npm start`; set the environment variables from `Firstshadi-backend/.env.example` in the app settings. The `prestart` script runs migrations automatically before the server starts. Set `UPLOAD_DIR` to a writable directory that persists across app restarts. Allow the app's host to connect to the Hostinger MySQL database.

Build the frontend from the repository root with `npm ci && npm run build`, set `VITE_API_URL` to the backend's HTTPS API URL ending in `/api`, and publish the contents of `dist`. Set backend `FRONTEND_URL` to the frontend's exact HTTPS origin.

## Required backend environment variables

- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (a unique, long random value)
- `FRONTEND_URL` (or comma-separated `FRONTEND_URLS`)
- `UPLOAD_DIR` pointing at persistent storage

The frontend build requires `VITE_API_URL`. Changing it after a static build requires rebuilding the frontend.
