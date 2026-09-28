"use client";

import { useState } from "react";
import { CreditCard, LoaderCircle, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type BillingActionsProps = {
  hasBillingAccount: boolean;
  canSubscribe: boolean;
};

export function BillingActions({
  hasBillingAccount,
  canSubscribe,
}: BillingActionsProps) {
  const [loadingAction, setLoadingAction] = useState<"checkout" | "portal" | null>(
    null,
  );

  async function openBillingRoute(route: "checkout" | "portal") {
    setLoadingAction(route);

    try {
      const response = await fetch(`/api/billing/${route}`, { method: "POST" });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Billing is temporarily unavailable.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setLoadingAction(null);
      toast.error(
        error instanceof Error ? error.message : "Billing is temporarily unavailable.",
      );
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {canSubscribe ? (
        <Button
          size="lg"
          className="h-12 rounded-full px-5"
          disabled={loadingAction !== null}
          onClick={() => openBillingRoute("checkout")}
        >
          {loadingAction === "checkout" ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <CreditCard />
          )}
          Subscribe for $9.99
        </Button>
      ) : null}

      {hasBillingAccount ? (
        <Button
          size="lg"
          variant="outline"
          className="h-12 rounded-full px-5"
          disabled={loadingAction !== null}
          onClick={() => openBillingRoute("portal")}
        >
          {loadingAction === "portal" ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Settings2 />
          )}
          Manage billing
        </Button>
      ) : null}
    </div>
  );
}
