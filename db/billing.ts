import "server-only";

import { eq, or } from "drizzle-orm";

import { db } from "./index";
import { billingEvents, creditTransactions, users } from "./schema";
import { getSubscriptionBillingPeriodKey } from "@/lib/dodo-webhook";

export const MONTHLY_PRO_CREDITS = 30;

export type SubscriptionBillingEvent = {
  webhookId: string;
  type: string;
  appUserId: string | null;
  customerId: string;
  customerEmail: string;
  subscriptionId: string;
  productId: string;
  status: string;
  currentPeriodEnd: string | null;
  resetCredits: boolean;
};

function parseDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function processSubscriptionBillingEvent(
  event: SubscriptionBillingEvent,
) {
  return db.transaction(async (tx) => {
    const [insertedEvent] = await tx
      .insert(billingEvents)
      .values({
        id: event.webhookId,
        type: event.type,
        dodoSubscriptionId: event.subscriptionId,
      })
      .onConflictDoNothing({ target: billingEvents.id })
      .returning({ id: billingEvents.id });

    if (!insertedEvent) {
      return { outcome: "duplicate" as const };
    }

    const match = event.appUserId
      ? or(
          eq(users.id, event.appUserId),
          eq(users.dodoCustomerId, event.customerId),
          eq(users.email, event.customerEmail),
        )
      : or(
          eq(users.dodoCustomerId, event.customerId),
          eq(users.email, event.customerEmail),
        );

    const [user] = await tx.select().from(users).where(match).limit(1);

    if (!user) {
      throw new Error("No Magnify user matches this Dodo subscription event.");
    }

    const currentPeriodEnd = parseDate(event.currentPeriodEnd);
    let nextCredits = user.credits;

    if (event.resetCredits) {
      const billingPeriodKey = getSubscriptionBillingPeriodKey(
        event.subscriptionId,
        event.currentPeriodEnd,
      );
      const creditDelta = MONTHLY_PRO_CREDITS - user.credits;
      const [recordedReset] = await tx
        .insert(creditTransactions)
        .values({
          userId: user.id,
          amount: creditDelta,
          kind: "subscription_reset",
          externalEventId: event.webhookId,
          billingPeriodKey,
        })
        .onConflictDoNothing({
          target: creditTransactions.billingPeriodKey,
        })
        .returning({ id: creditTransactions.id });

      if (recordedReset) {
        nextCredits = MONTHLY_PRO_CREDITS;
      }
    }

    await tx
      .update(users)
      .set({
        credits: nextCredits,
        subscriptionStatus: event.status,
        dodoCustomerId: event.customerId,
        dodoSubscriptionId: event.subscriptionId,
        dodoProductId: event.productId,
        subscriptionCurrentPeriodEnd: currentPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    await tx
      .update(billingEvents)
      .set({ userId: user.id })
      .where(eq(billingEvents.id, event.webhookId));

    return {
      outcome: "processed" as const,
      userId: user.id,
      credits: nextCredits,
    };
  });
}
