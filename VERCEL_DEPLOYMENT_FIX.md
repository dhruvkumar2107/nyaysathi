# STAFF+ VERCEL NODE 24 DEPLOYMENT FIX

**STRICT COMPLIANCE MODE: ENABLED**
This repository has been retrofitted for **Node.js 24.x**. Dependencies are pinned, Semantic Versioning ranges (`^`, `~`) are REMOVED, and transitive dependencies are explicit.

## 1. Vercel Dashboard Settings (MANDATORY)

Go to **Settings > General** on Vercel and configure EXACTLY:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | |
| **Root Directory** | `client` | |
| **Build Command** | `vite build` | |
| **Output Directory** | `dist` | |
| **Install Command** | `npm install` | Do not use `yarn` or `pnpm` unless configured. |
| **Node.js Version** | **24.x** | **CRITICAL:** Select 24 from dropdown. |

---

## 2. Deployment Protocol

Execute these steps locally one last time to ensure cache is cleared:

```bash
cd client
# Nuking node_modules to simulate Vercel Clean Install
rm -rf node_modules package-lock.json
npm install
npm run build
```

**If this succeeds locally (it just did for me), you are green for launch.**

---

## 3. The Corrected Files (Already on Disk)

### `client/package.json` (Node 24 + Pinned Deps)
```json
{
  "name": "nyay-sathi-client",
  "version": "1.0.1",
  "private": true,
  "type": "module",
  "engines": {
    "node": "24.x"
  },
  "packageManager": "npm@10.2.4",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@sentry/react": "8.26.0",
    "axios": "1.6.0",
    "posthog-js": "1.131.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-helmet-async": "2.0.5",
    "react-hot-toast": "2.4.1",
    "react-markdown": "9.0.1",
    "react-router-dom": "6.22.3",
    "react-signature-canvas": "1.0.6",
    "remark-gfm": "4.0.0",
    "socket.io-client": "4.7.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "4.2.1",
    "autoprefixer": "10.4.19",
    "postcss": "8.4.38",
    "tailwindcss": "3.4.3",
    "vite": "5.2.11",
    "node-releases": "2.0.14",
    "caniuse-lite": "1.0.30001614",
    "browserslist": "4.23.0",
    "update-browserslist-db": "1.0.14"
  }
}
```

### `client/.nvmrc`
```text
24.0.0
```

### `client/postcss.config.js` (ESM Strict)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

**STATUS: READY TO DEPLOY**
Push to GitHub to trigger Vercel.
