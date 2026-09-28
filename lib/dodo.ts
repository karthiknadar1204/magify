import "server-only";

import DodoPayments from "dodopayments";

function required(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export function getDodoEnvironment() {
  const environment = process.env.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode";

  if (environment !== "test_mode" && environment !== "live_mode") {
    throw new Error(
      "DODO_PAYMENTS_ENVIRONMENT must be test_mode or live_mode.",
    );
  }

  return environment;
}

export function getDodoClient(options?: { verifyWebhooks?: boolean }) {
  const webhookKey = options?.verifyWebhooks
    ? required("DODO_PAYMENTS_WEBHOOK_KEY")
    : process.env.DODO_PAYMENTS_WEBHOOK_KEY?.trim() || null;

  return new DodoPayments({
    bearerToken: required("DODO_PAYMENTS_API_KEY"),
    webhookKey,
    environment: getDodoEnvironment(),
  });
}

export function getDodoProductId() {
  return required("DODO_PAYMENTS_PRODUCT_ID");
}

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}
