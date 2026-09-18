# Expense Tracker — Frontend (Next.js)

UI for the Expense Tracker Web Application. Talks to the NestJS backend over REST, stores the JWT in `localStorage`.

**Live URL:** `https://expense-tracker-web-app-frontend.vercel.app`
**Backend API:** `https://expense-tracker-web-app-production-cbdd.up.railway.app`

---
<img width="1917" height="971" alt="Screenshot 2026-09-18 113149" src="https://github.com/user-attachments/assets/fda4c516-fc4c-4960-9261-30b41b72a68b" />
<img width="1917" height="972" alt="Screenshot 2026-09-18 113122" src="https://github.com/user-attachments/assets/3829829a-8e22-4b38-892a-f2b596eca39a" />
<img width="1906" height="963" alt="Screenshot 2026-09-18 113029" src="https://github.com/user-attachments/assets/d782953f-130c-49e9-ae44-bb1456f02a2f" />
<img width="1917" height="967" alt="Screenshot 2026-09-18 113041" src="https://github.com/user-attachments/assets/1d013a68-14fa-4e4b-a530-99f9863e0654" />
<img width="1917" height="968" alt="Screenshot 2026-09-18 113052" src="https://github.com/user-attachments/assets/a7060259-2178-4943-b90b-65414ae801a3" />
<img width="1917" height="972" alt="Screenshot 2026-09-18 113103" src="https://github.com/user-attachments/assets/498a0050-7567-45e3-9e49-ad5336e3c90a" />







## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP client | Axios |
| Charts | Recharts |
| Hosting | Vercel |

---

## Project Structure — IMPORTANT

With the Next.js **App Router**, every route folder **must live inside `app/`**. A folder like `login/` sitting at the repo root (next to `app/`, not inside it) will 404 in production even though it looks fine locally in some setups.

Correct structure:
```
frontend/
├── app/
│   ├── page.tsx              → redirects to /login
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── expenses/
│   │   └── page.tsx
│   ├── income/
│   │   └── page.tsx
│   └── reports/
│       └── page.tsx
├── components/
│   └── Navbar.tsx
├── lib/
│   └── api.ts                 → Axios instance + JWT interceptor
└── .env.local                 → NEXT_PUBLIC_API_URL (not committed)
```

Before pushing, always double-check that every page folder (`login`, `register`, `dashboard`, `expenses`, `income`, `reports`) sits **inside** `app/`, not at the project root.

---

## Pages

| Route | Description |
|---|---|
| `/` | Redirects to `/login` |
| `/login` | Login form |
| `/register` | Registration form |
| `/dashboard` | Total income / expense / balance cards |
| `/expenses` | Add / list / delete expenses |
| `/income` | Add / list / delete income |
| `/reports` | Bar chart (expense by category) + pie chart (income vs expense) |

---

## Environment Variables

Create `.env.local` (never committed — already in `.gitignore`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, set this in Vercel → Project → Settings → Environment Variables, pointing to the deployed backend URL.

`lib/api.ts` reads it like this:
```ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});
```

---

## Local Development

```bash
npm install
npm install axios recharts
npm run dev
```

App runs at `http://localhost:3000`. Make sure the backend is running at `http://localhost:5000` (or update `NEXT_PUBLIC_API_URL`).

---

## Auth Flow

1. Register/Login → backend returns `{ access_token, user }`
2. Token saved to `localStorage`
3. Axios interceptor in `lib/api.ts` attaches it to every request:
   ```ts
   Authorization: Bearer <token>
   ```
4. Logout clears the token and redirects to `/login`
5. Dashboard/Expenses/Income/Reports pages redirect to `/login` if there's no token or the API returns 401

---

## Deployment (Vercel)

1. Push this repo to GitHub (make sure `app/` contains all page folders — see the structure note above).
2. Vercel → Add New → Project → Import this repo.
3. Framework Preset: Next.js (auto-detected).
4. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.up.railway.app
   ```
5. Deploy.
6. Vercel → Settings → Git → **Production Branch** must match the branch you actually push to (commonly `main`) — a mismatch here silently deploys stale/default content.

After the backend's CORS is updated to allow this frontend's origin, everything should connect end-to-end.

---

## Common Issues & Fixes

| Symptom | Cause | Fix |
|---|---|---|
| Site shows default "Next.js" starter page | `app/page.tsx` was never customized | Replace it with a redirect to `/login`, or build a real landing page |
| `/login`, `/register` etc. 404 in production but seemed fine locally | Page folders created outside `app/` (at repo root) | Move every route folder inside `app/` |
| Deployed site shows old/empty content | Vercel's **Production Branch** doesn't match the branch you push to | Vercel → Settings → Git → set Production Branch to `main` (or whichever you use) |
| `POST /auth/register` fails with CORS error in console | Backend CORS origin doesn't include this frontend's URL | Update `app.enableCors({ origin: '...' })` in the backend and redeploy |
| API calls go to `localhost:5000` in production | `NEXT_PUBLIC_API_URL` not set in Vercel | Add it under Vercel → Settings → Environment Variables, then redeploy |
| 404 on every backend call right after deploy | Multiple stale `node` processes locally holding the dev port (local dev only) | `taskkill /F /IM node.exe`, restart `npm run dev` fresh |
