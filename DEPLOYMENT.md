# Deployment checklist

## Before deploying

1. Configure the production environment variables below in the hosting dashboard. Do not upload a `.env` file.
2. Create a production MySQL database and allow the backend host to connect to it.
3. The backend runs pending migrations against the configured database before it starts listening.
4. Create a real admin account, then grant it admin access in the production database. Do not use a sample user's credentials.

## Render

Deploy the backend as a **Web Service** with:

- Root directory: `Firstshadi-backend`
- Build command: `npm ci`
- Start command: `npm start`
- Health check path: `/api/health`
- Environment: copy the keys from `Firstshadi-backend/.env.example` into Render's Environment settings. Render supplies `PORT` automatically.
- Persistent disk: mount at `/var/data`; set `UPLOAD_DIR=/var/data/uploads`.

The backend entry point runs pending migrations before opening the HTTP listener.

Deploy the frontend as a **Static Site** with:

- Root directory: repository root
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Build environment variable: `VITE_API_URL=https://<backend-service>.onrender.com/api`
- Rewrite rule: `/*` to `/index.html` with status `200` for React Router routes.

After the frontend has a URL, set the backend's `FRONTEND_URL` to that exact origin (scheme and hostname, no path), then redeploy the backend.

## Hostinger

Use a plan that supports Node.js applications, or a VPS. Deploy the backend from `Firstshadi-backend` with `npm install` and set the environment variables from `Firstshadi-backend/.env.example` in the app settings. Keep the entry file as `server.js`; it runs pending migrations automatically before the server starts. Allow the app's host to connect to the Hostinger MySQL database. Profile photo uploads are stored in the configured S3 bucket.

Build the frontend from the repository root with `npm ci && npm run build`, set `VITE_API_URL` to the backend's HTTPS API URL ending in `/api`, and publish the contents of `dist`. Set backend `FRONTEND_URL` to the frontend's exact HTTPS origin.

## Required backend environment variables

- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (a unique, long random value)
- `FRONTEND_URL` (or comma-separated `FRONTEND_URLS`)
- `UPLOAD_DIR` pointing at persistent storage
- `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` for profile photo storage

The frontend build requires `VITE_API_URL`. Changing it after a static build requires rebuilding the frontend.

## AWS S3 profile photo storage

Create a bucket in the region configured by `AWS_REGION`, then set the four S3 variables above in Hostinger's backend environment settings. Use an IAM user/access key restricted to this bucket with `s3:PutObject` and `s3:DeleteObject`; photo uploads do not need public write or bucket listing permissions. Never commit access keys.

Profile photos are currently publicly viewable by URL, as they were when served from `/uploads`. To preserve that behavior, allow public `s3:GetObject` only for `arn:aws:s3:::<bucket-name>/profiles/*` in the bucket policy, while keeping bucket listing and all other objects private. Do not grant public writes or enable ACL-based public access. Alternatively, set `AWS_S3_PUBLIC_URL` to a public CloudFront/custom domain backed by the bucket. Existing `/uploads/...` photo links remain readable from the old Hostinger storage; newly uploaded photos use S3.
