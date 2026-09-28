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
