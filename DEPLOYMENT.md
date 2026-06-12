# Deployment Guide

This document covers deployment instructions for the WriteSpace application.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Build](#build)
- [Vercel Deployment](#vercel-deployment)
  - [Automatic Deployment from Git](#automatic-deployment-from-git)
  - [Manual Deployment via Vercel CLI](#manual-deployment-via-vercel-cli)
  - [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Other Hosting Platforms](#other-hosting-platforms)
- [Environment Notes](#environment-notes)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)

---

## Overview

WriteSpace is a fully client-side React single-page application (SPA) built with Vite. It requires no backend server, no database, and no environment variables. All data is persisted in the browser's `localStorage`. This makes deployment straightforward — you only need to serve the static files produced by the build step.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (included with Node.js)
- A [Vercel](https://vercel.com/) account (for Vercel deployment)
- A Git repository hosted on GitHub, GitLab, or Bitbucket (for automatic deployments)

---

## Build

To create a production build, run:

```bash
npm install
npm run build
```

This executes `vite build` under the hood and outputs optimized static files to the `dist/` directory.

The `dist/` directory will contain:

- `index.html` — The single HTML entry point
- `assets/` — Hashed JavaScript and CSS bundles
- Any static assets from the `public/` directory (e.g., `vite.svg`)

You can preview the production build locally before deploying:

```bash
npm run preview
```

This starts a local server (typically at `http://localhost:4173`) serving the contents of `dist/`.

---

## Vercel Deployment

Vercel is the recommended hosting platform for WriteSpace. The project includes a `vercel.json` configuration file that handles SPA routing out of the box.

### Automatic Deployment from Git

This is the recommended approach. Vercel will automatically build and deploy your application on every push to your repository.

1. **Push your code** to a Git repository on GitHub, GitLab, or Bitbucket.

2. **Import the project** in the [Vercel Dashboard](https://vercel.com/dashboard):
   - Click **Add New → Project**.
   - Select your Git provider and authorize access if prompted.
   - Choose the repository containing your WriteSpace code.

3. **Configure build settings** — Vercel will auto-detect the Vite framework and pre-fill the correct values:

   | Setting          | Value            |
   |------------------|------------------|
   | Framework Preset | Vite             |
   | Build Command    | `npm run build`  |
   | Output Directory | `dist`           |
   | Install Command  | `npm install`    |

4. **Click Deploy** — Vercel will install dependencies, run the build, and deploy the output.

5. **Access your site** at the URL provided by Vercel (e.g., `https://your-project.vercel.app`).

After the initial setup, every push to the default branch (e.g., `main`) triggers a **production deployment**. Pushes to other branches trigger **preview deployments** with unique URLs.

### Manual Deployment via Vercel CLI

If you prefer to deploy from your local machine without connecting a Git repository:

1. **Install the Vercel CLI globally:**

   ```bash
   npm install -g vercel
   ```

2. **Log in to your Vercel account:**

   ```bash
   vercel login
   ```

3. **Deploy from the project root:**

   ```bash
   vercel
   ```

   Follow the prompts to link or create a project. Vercel will build and deploy automatically.

4. **Deploy to production:**

   ```bash
   vercel --prod
   ```

### SPA Rewrite Configuration

WriteSpace uses client-side routing via React Router v6. All routes (e.g., `/blogs`, `/login`, `/admin/dashboard`) are handled in the browser by JavaScript — they do not correspond to physical files on the server.

Without a rewrite rule, navigating directly to a route like `https://your-app.vercel.app/blogs` would result in a **404 error** because no `blogs/index.html` file exists in the `dist/` directory.

The `vercel.json` file at the project root solves this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This rule tells Vercel to serve `index.html` for **all** URL paths, allowing React Router to handle routing on the client side. This configuration is already included in the repository — no additional setup is required.

---

## Other Hosting Platforms

WriteSpace can be deployed to any static hosting platform. The key requirement is configuring a **catch-all rewrite** so that all routes serve `index.html`.

### Netlify

Create a `public/_redirects` file (or `dist/_redirects` post-build):

```
/*    /index.html   200
```

Or create a `netlify.toml` in the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. A common workaround is to use a custom `404.html` that redirects to `index.html`. Note that GitHub Pages is not the recommended platform for SPAs with client-side routing.

### Generic Static Hosting

For any static file server (Nginx, Apache, Caddy, S3 + CloudFront, etc.):

1. Run `npm run build` to generate the `dist/` directory.
2. Upload the contents of `dist/` to your hosting provider.
3. Configure the server to return `index.html` for all routes that do not match a static file.

**Nginx example:**

```nginx
server {
    listen 80;
    root /var/www/writespace/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Environment Notes

WriteSpace is a **fully client-side application** with no server-side dependencies:

- **No environment variables are required.** The application does not use `import.meta.env.VITE_*` or any other environment variable configuration.
- **No backend API** is needed. All data (posts, users, sessions) is stored in the browser's `localStorage`.
- **No database** is required. Data persistence is handled entirely on the client side.
- **No authentication server** is needed. Authentication is managed locally with a hard-coded admin account (`admin` / `admin123`) and localStorage-based user records.

This means the deployment process is the same for all environments (development, staging, production) — simply serve the static files from the `dist/` directory.

---

## CI/CD Notes

### Vercel Auto-Deploy from Git

When your repository is connected to Vercel, the following CI/CD workflow is automatic:

| Trigger                        | Deployment Type | URL                                      |
|--------------------------------|-----------------|------------------------------------------|
| Push to `main` (or default)   | Production      | `https://your-project.vercel.app`        |
| Push to any other branch       | Preview         | `https://your-project-<hash>.vercel.app` |
| Pull request opened/updated    | Preview         | Linked in the PR as a comment            |

**No additional CI/CD configuration is needed.** Vercel handles:

- Installing dependencies (`npm install`)
- Running the build (`npm run build`)
- Deploying the `dist/` output
- Assigning URLs and managing SSL certificates

### Running Tests in CI

If you want to run tests before deployment, you can configure Vercel to run them as part of the build step. Update the build command in the Vercel Dashboard or `vercel.json`:

```json
{
  "buildCommand": "npm run test && npm run build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Alternatively, use a separate CI pipeline (e.g., GitHub Actions) to run tests on every push, independent of the Vercel deployment:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm run test
```

### Build Output

The production build produces the following:

```
dist/
├── index.html
├── vite.svg
└── assets/
    ├── index-<hash>.js
    └── index-<hash>.css
```

All assets are content-hashed for optimal caching. Vercel (and most CDNs) will serve these with long-lived cache headers automatically.

---

## Troubleshooting

### 404 errors on page refresh

If you see a 404 when refreshing a page like `/blogs` or `/admin/dashboard`, the SPA rewrite rule is not configured correctly. Ensure `vercel.json` is present in the project root with the rewrite rule shown above.

### Blank page after deployment

Check the browser console for errors. Common causes:

- **Asset paths:** Ensure `vite.config.js` does not set a custom `base` path unless your deployment requires one.
- **Build errors:** Run `npm run build` locally and verify the `dist/` directory contains `index.html` and the `assets/` folder.

### Data not persisting

WriteSpace stores all data in `localStorage`. Data is:

- **Browser-specific** — data saved in Chrome is not available in Firefox.
- **Device-specific** — data on your laptop is not available on your phone.
- **Cleared when browser data is cleared** — clearing cookies/storage removes all WriteSpace data.

This is by design. WriteSpace is a local-first application with no server-side data synchronization.

### Tests failing in CI

Ensure the CI environment uses Node.js v18 or higher. Run `npm install` before `npm run test`. The test suite uses `vitest` with `jsdom` and does not require a browser or display server.