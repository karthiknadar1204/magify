# Dodo Payments setup

Magnify uses Dodo Payments for the hosted subscription checkout and billing portal. Credits remain in Magnify's Postgres database and are updated from signed Dodo subscription webhooks.

## Local development with ngrok

Run the app and tunnel in separate terminals:

```bash
npm run dev
ngrok http 3000
```

Use the HTTPS forwarding address printed by ngrok and append the exact webhook route:

```text
https://<your-ngrok-domain>/api/webhooks/dodo
```

The route is plural: `/api/webhooks/dodo`. A free ngrok domain normally changes when the tunnel is restarted, so update the Dodo test-mode endpoint whenever that happens and retrieve its signing secret again if a new endpoint is created.

The Dodo test webhook should be enabled only for these event types:

- `subscription.active`
- `subscription.cancelled`
- `subscription.expired`
- `subscription.failed`
- `subscription.on_hold`
- `subscription.past_due`
- `subscription.paused`
- `subscription.plan_changed`
- `subscription.renewed`
- `subscription.unpaused`
- `subscription.updated`

Set `DODO_PAYMENTS_ENVIRONMENT=test_mode`, use a test-mode API key and product ID, and store the endpoint's signing secret in `DODO_PAYMENTS_WEBHOOK_KEY`. Never commit these values.

`NEXT_PUBLIC_APP_URL=http://localhost:3000` is correct while checkout is being completed on the same development machine. The ngrok URL is needed specifically so Dodo's servers can reach the webhook.

## Production deployment

After the app is deployed, create a new webhook in Dodo **Live Mode** using the permanent public app domain:

```text
https://<your-production-domain>/api/webhooks/dodo
```

For example, if the app is deployed at `https://magnify.example.com`, the webhook URL must be:

```text
https://magnify.example.com/api/webhooks/dodo
```

Configure the production environment with:

```text
NEXT_PUBLIC_APP_URL=https://<your-production-domain>
DODO_PAYMENTS_ENVIRONMENT=live_mode
DODO_PAYMENTS_API_KEY=<live-mode read/write API key>
DODO_PAYMENTS_PRODUCT_ID=<live-mode Magnify Pro product ID>
DODO_PAYMENTS_WEBHOOK_KEY=<secret from the live webhook endpoint>
```

Test-mode products, API keys, webhook endpoints, and signing secrets do not carry over to Live Mode. Create each live resource separately, keep the same 11-event filter, and verify an initial checkout, renewal, cancellation, and failed-payment flow before launch.

## Verification

A reachable endpoint returns `405` for a browser `GET`, because it intentionally accepts only signed `POST` requests. A valid signed event returns `200`. Invalid or unsigned requests return `400`.

Credit resets are idempotent. `subscription.active` and `subscription.renewed` reset the account to 30 credits; other supported lifecycle events update subscription state without granting an additional monthly balance.
