import { describe, expect, it } from "vitest";

import {
  getSubscriptionBillingPeriodKey,
  isSupportedSubscriptionEvent,
  shouldResetSubscriptionCredits,
} from "../lib/dodo-webhook";

describe("Dodo subscription webhooks", () => {
  it("recognises the subscription lifecycle events Magnify consumes", () => {
    expect(isSupportedSubscriptionEvent("subscription.active")).toBe(true);
    expect(isSupportedSubscriptionEvent("subscription.past_due")).toBe(true);
    expect(isSupportedSubscriptionEvent("subscription.updated")).toBe(true);
    expect(isSupportedSubscriptionEvent("payment.succeeded")).toBe(false);
  });

  it("resets monthly credits only on activation and renewal", () => {
    expect(shouldResetSubscriptionCredits("subscription.active")).toBe(true);
    expect(shouldResetSubscriptionCredits("subscription.renewed")).toBe(true);
    expect(shouldResetSubscriptionCredits("subscription.updated")).toBe(false);
    expect(shouldResetSubscriptionCredits("subscription.cancelled")).toBe(false);
  });

  it("deduplicates credit grants by subscription billing period", () => {
    expect(
      getSubscriptionBillingPeriodKey(
        "sub_123",
        "2026-10-28T10:15:10.424152Z",
      ),
    ).toBe("sub_123:2026-10-28T10:15:10.424Z");
    expect(
      getSubscriptionBillingPeriodKey(
        "sub_123",
        "2026-11-28T10:15:10.424152Z",
      ),
    ).not.toBe("sub_123:2026-10-28T10:15:10.424Z");
  });
});
