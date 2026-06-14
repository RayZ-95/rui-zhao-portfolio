# Rui Zhao Academic Portfolio

An English academic portfolio website for Rui Zhao, built with Next.js App Router, Tailwind CSS, GSAP, and Three.js.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin

Open `/admin`. The temporary v1 password is controlled by `ADMIN_PASSWORD`; if it is not set, the local fallback is `rui-admin`.

The admin stores editable projects, publications, and teaching entries in `data/content.json`. This is suitable for local editing and a first prototype. For production on Vercel, move this storage to a managed database and object storage.
