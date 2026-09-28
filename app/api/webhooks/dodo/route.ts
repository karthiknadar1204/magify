import { processSubscriptionBillingEvent } from "@/db/billing";
import { getDodoClient, getDodoProductId } from "@/lib/dodo";
import { shouldResetSubscriptionCredits } from "@/lib/dodo-webhook";

export const runtime = "nodejs";

function requiredHeader(request: Request, name: string) {
  const value = request.headers.get(name);

  if (!value) {
    throw new Error(`Missing ${name} header.`);
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const webhookId = requiredHeader(request, "webhook-id");
    const event = getDodoClient({ verifyWebhooks: true }).webhooks.unwrap(body, {
      headers: {
        "webhook-id": webhookId,
        "webhook-signature": requiredHeader(request, "webhook-signature"),
        "webhook-timestamp": requiredHeader(request, "webhook-timestamp"),
      },
    });

    switch (event.type) {
      case "subscription.active":
      case "subscription.cancelled":
      case "subscription.expired":
      case "subscription.failed":
      case "subscription.on_hold":
      case "subscription.past_due":
      case "subscription.paused":
      case "subscription.plan_changed":
      case "subscription.renewed":
      case "subscription.unpaused":
      case "subscription.updated": {
        const subscription = event.data;

        if (subscription.product_id !== getDodoProductId()) {
          return Response.json({ received: true, ignored: true });
        }

        const metadataUserId = subscription.metadata.app_user_id;
        const result = await processSubscriptionBillingEvent({
          webhookId,
          type: event.type,
          appUserId:
            typeof metadataUserId === "string" ? metadataUserId : null,
          customerId: subscription.customer.customer_id,
          customerEmail: subscription.customer.email,
          subscriptionId: subscription.subscription_id,
          productId: subscription.product_id,
          status: subscription.status,
          currentPeriodEnd: subscription.next_billing_date ?? null,
          resetCredits: shouldResetSubscriptionCredits(event.type),
        });

        return Response.json({ received: true, outcome: result.outcome });
      }
      default:
        return Response.json({ received: true, ignored: true });
    }
  } catch (error) {
    console.error("Dodo webhook processing failed", error);
    return Response.json(
      { error: "Invalid or unprocessable webhook." },
      { status: 400 },
    );
  }
}
