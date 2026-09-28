const supportedSubscriptionEvents = new Set([
  "subscription.active",
  "subscription.cancelled",
  "subscription.expired",
  "subscription.failed",
  "subscription.on_hold",
  "subscription.past_due",
  "subscription.paused",
  "subscription.plan_changed",
  "subscription.renewed",
  "subscription.unpaused",
  "subscription.updated",
]);

export function isSupportedSubscriptionEvent(type: string) {
  return supportedSubscriptionEvents.has(type);
}

export function shouldResetSubscriptionCredits(type: string) {
  return type === "subscription.active" || type === "subscription.renewed";
}

export function getSubscriptionBillingPeriodKey(
  subscriptionId: string,
  currentPeriodEnd: string | null,
) {
  if (!currentPeriodEnd) {
    return `${subscriptionId}:unknown-period`;
  }

  const periodEnd = new Date(currentPeriodEnd);

  if (Number.isNaN(periodEnd.getTime())) {
    return `${subscriptionId}:unknown-period`;
  }

  return `${subscriptionId}:${periodEnd.toISOString()}`;
}
