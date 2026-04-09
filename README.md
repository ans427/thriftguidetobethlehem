# Thrift Guide to Bethlehem

React + Vite frontend with Sanity CMS for thrift stores and sustainability resources.

## Frontend

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set your Sanity project ID and dataset (see `.env.example` for the shape of the file).

## Sanity Studio

```bash
npm run studio
```

Open the URL shown in the terminal (defaults to port `3333`). Create **Thrift Store** and **Resource Article** documents; featured items appear on the homepage.

## Linking this repo to an existing Sanity project

Unattended `create-sanity` requires an output path and usually `-y`:

```bash
npm create sanity@latest -- -y --project YOUR_PROJECT_ID --dataset production --template clean --output-path .
```

If files like `sanity.config.js` already exist, the CLI may **skip** overwriting them and only add template assets.

## Build

- Site: `npm run build`
- Studio (optional): `npm run build:studio`

## Shared comments on Vercel (recommended)

The frontend now posts comments to `POST /api/comments` when deployed, so your write token can stay server-side.

Set these in Vercel Project Settings -> Environment Variables:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_WRITE_TOKEN` (Editor role or scoped token that can create `storeComment`)

After setting env vars, redeploy.

If the API route is not configured, the app falls back to browser-only comments.

Note: This line is a tiny deploy-trigger update.

## Docs

- [Sanity getting started](https://www.sanity.io/docs/introduction/getting-started)
