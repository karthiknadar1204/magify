import { APIError } from "dodopayments";

import { getAuthenticatedAppUser } from "@/lib/auth";
import { getAppUrl, getDodoClient, getDodoProductId } from "@/lib/dodo";

export const runtime = "nodejs";

export async function POST() {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const canStartNewSubscription =
    !user.dodoSubscriptionId ||
    ["cancelled", "expired", "failed"].includes(user.subscriptionStatus);

  if (!canStartNewSubscription) {
    return Response.json(
      { error: "Manage your current Magnify Pro subscription instead." },
      { status: 409 },
    );
  }

  try {
    const appUrl = getAppUrl();
    const session = await getDodoClient().checkoutSessions.create({
      product_cart: [{ product_id: getDodoProductId(), quantity: 1 }],
      customer: user.dodoCustomerId
        ? { customer_id: user.dodoCustomerId }
        : {
            email: user.email,
            name: user.name ?? undefined,
          },
      metadata: {
        app_user_id: user.id,
        clerk_user_id: user.clerkUserId,
      },
      return_url: `${appUrl}/billing?checkout=success`,
      cancel_url: `${appUrl}/billing?checkout=cancelled`,
      customization: { theme: "system" },
      feature_flags: {
        allow_customer_editing_email: false,
        allow_customer_editing_name: true,
        allow_discount_code: true,
        redirect_immediately: true,
      },
    });

    if (!session.checkout_url) {
      throw new Error("Dodo did not return a checkout URL.");
    }

    return Response.json({ url: session.checkout_url });
  } catch (error) {
    const message =
      error instanceof APIError && error.status === 401
        ? "Dodo Payments rejected the test API key."
        : "Checkout is temporarily unavailable. Please try again.";

    return Response.json({ error: message }, { status: 503 });
  }
}
