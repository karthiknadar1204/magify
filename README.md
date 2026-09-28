# Magnify

Magnify is a focused AI photo editor for natural enhancement, professional headshots, product photography, old-photo restoration, and precise custom edits.

The current private beta is free and does not include a payment gateway or paywall. Billing will be added only after the complete product flow has been tested with real users.

## Stack

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS
- Clerk authentication with custom sign-in and sign-up pages
- Drizzle ORM with Neon Postgres
- OpenAI Image API for edits
- Private Cloudflare R2 media storage in production
- Local private media storage and an explicit mock-AI mode for development
- Vitest for image validation and prompt-preset tests

## Local setup

Install dependencies and copy the environment template:

```bash
npm install
cp .env.example .env.local
```

Fill in the required values in `.env.local`, then apply the database migrations and start the app:

```bash
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test without AI credits or R2

Set this only in local development:

```bash
MAGIFY_MOCK_AI=true
```

Mock mode runs the complete upload, database, processing, result, download, history, and deletion workflow locally. Its output is visibly labelled `LOCAL TEST RESULT`. Mock mode is disabled in production even if the variable is accidentally set.

When R2 credentials are absent, development media is stored under the ignored `.local-media` directory. Production intentionally fails closed until R2 is configured.

## Environment variables

See [`.env.example`](./.env.example) for the complete list. Never commit `.env.local` or real service credentials.

Required for production:

- Clerk publishable and secret keys
- Neon `DATABASE_URL`
- OpenAI API key with image-generation credits
- Cloudflare R2 account ID, access key, secret, and bucket name

## Useful commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Privacy model

- Every generation is owned by a local app user mapped to a Clerk user.
- Original and result media are returned only through authenticated API routes.
- Generation lookups verify ownership before reading or deleting media.
- Uploads are limited to JPG, PNG, and WebP files up to 12 MB and normalized before processing.
- Deleting an edit soft-deletes its database record and removes its stored media.

## Before deployment

1. Use production Clerk keys and complete the Clerk production-instance setup.
2. Configure an R2 bucket and scoped object read/write credentials.
3. Fund the OpenAI project, set `MAGIFY_MOCK_AI=false`, and run a real edit.
4. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
5. Rotate any credentials that were shared during development.
