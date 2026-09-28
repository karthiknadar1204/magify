# Production deployment

## Environment variables

Configure these variables in the deployment platform. Use production or live-mode credentials—do not copy Magnify's local Clerk development keys or Dodo test-mode resources into production.

```text
# Clerk production instance
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<Clerk production publishable key>
CLERK_SECRET_KEY=<Clerk production secret key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Neon production database
DATABASE_URL=<pooled Neon Postgres connection string with SSL>

# OpenAI
OPENAI_API_KEY=<funded production OpenAI project key>
OPENAI_IMAGE_MODEL=gpt-image-2.5-sunburst
MAGNIFY_MOCK_AI=false

# Cloudflare R2
R2_ACCOUNT_ID=<Cloudflare account ID>
R2_ACCESS_KEY_ID=<R2 scoped access key ID>
R2_SECRET_ACCESS_KEY=<R2 scoped secret access key>
R2_BUCKET_NAME=<private production bucket name>

# Public application origin
NEXT_PUBLIC_APP_URL=https://<your-production-domain>

# Dodo Payments Live Mode
DODO_PAYMENTS_API_KEY=<live-mode read/write API key>
DODO_PAYMENTS_WEBHOOK_KEY=<live webhook signing secret>
DODO_PAYMENTS_PRODUCT_ID=<live Magnify Pro product ID>
DODO_PAYMENTS_ENVIRONMENT=live_mode
```

`NODE_ENV` is managed by the hosting platform and should not be added manually.

## Provider configuration

1. Create or promote a Clerk production instance, add the production domain, and use its `pk_live_...` and `sk_live_...` values.
2. Use Neon's pooled Postgres connection string and run `npm run db:migrate` against the production database once before serving traffic.
3. Create a private R2 bucket and an API token restricted to object read/write access for that bucket. Magnify intentionally refuses production media operations when these credentials are absent.
4. Use a funded OpenAI project key and verify one real image edit with `MAGNIFY_MOCK_AI=false`.
5. Recreate Magnify Pro in Dodo Live Mode, create a live read/write API key, and register the webhook below with the 11 event filters listed in [`dodo-payments.md`](./dodo-payments.md).

```text
https://<your-production-domain>/api/webhooks/dodo
```

6. Copy the live webhook's signing secret into `DODO_PAYMENTS_WEBHOOK_KEY`. Test checkout, credit delivery, billing-portal access, renewal, cancellation, and failed-payment handling before opening the app publicly.

## Security checks

- Keep every secret in the deployment platform's encrypted environment settings.
- Do not prefix server-only values with `NEXT_PUBLIC_`.
- Never commit `.env.local`, production credentials, database URLs, or webhook secrets.
- Rotate the OpenAI and Dodo keys that were shared during development before production launch.
- Configure the same variables for the production environment separately from preview deployments.
