import { Check, CreditCard, Sparkles, WandSparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { BillingActions } from "@/components/billing-actions";
import { Badge } from "@/components/ui/badge";
import { getAuthenticatedAppUser } from "@/lib/auth";

type BillingPageProps = {
  searchParams: Promise<{ checkout?: string }>;
};

export const metadata = { title: "Billing" };

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const [user, query] = await Promise.all([
    getAuthenticatedAppUser(),
    searchParams,
  ]);

  if (!user) redirect("/sign-in");

  const isActive = user.subscriptionStatus === "active";
  const canSubscribe =
    !user.dodoSubscriptionId ||
    ["cancelled", "expired", "failed"].includes(user.subscriptionStatus);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
          Billing
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Simple credits, no surprises.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          A credit is used only when Magnify successfully finishes an edit. Failed
          generations are automatically refunded.
        </p>
      </div>

      {query.checkout === "success" ? (
        <div className="mt-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-800">
          Payment received. Your Pro credits will appear as soon as Dodo confirms the
          subscription.
        </div>
      ) : null}
      {query.checkout === "cancelled" ? (
        <div className="mt-8 rounded-2xl border border-foreground/10 bg-card px-4 py-3 text-sm text-muted-foreground">
          Checkout was cancelled. Nothing was charged.
        </div>
      ) : null}

      <div className="mt-9 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <section className="rounded-[2rem] border border-foreground/8 bg-card/75 p-6 shadow-sm">
          <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <WandSparkles className="size-5" />
          </span>
          <p className="mt-6 text-sm font-medium text-muted-foreground">
            Available credits
          </p>
          <p className="mt-1 text-5xl font-semibold tracking-[-0.05em]">
            {user.credits}
          </p>
          <div className="mt-5 flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Magnify Pro" : "Free access"}
            </Badge>
            <span className="text-xs capitalize text-muted-foreground">
              {user.subscriptionStatus.replaceAll("_", " ")}
            </span>
          </div>
          {user.subscriptionCurrentPeriodEnd ? (
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Current period ends {user.subscriptionCurrentPeriodEnd.toLocaleDateString()}.
            </p>
          ) : null}
        </section>

        <section className="relative overflow-hidden rounded-[2rem] bg-foreground p-7 text-background shadow-xl sm:p-9">
          <div className="absolute -right-16 -top-20 size-56 rounded-full bg-primary/35 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white/60">Magnify Pro</p>
                <p className="mt-2 text-4xl font-semibold tracking-[-0.045em]">
                  $9.99
                  <span className="ml-1 text-base font-normal text-white/55">/ month</span>
                </p>
              </div>
              <span className="grid size-11 place-items-center rounded-2xl bg-white/10">
                <Sparkles className="size-5 text-accent" />
              </span>
            </div>

            <ul className="mt-8 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
              {[
                "30 successful edits every month",
                "All five focused editing tools",
                "Private originals and results",
                "Failed edits never consume credit",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" /> {item}
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <BillingActions
                hasBillingAccount={Boolean(user.dodoCustomerId)}
                canSubscribe={canSubscribe}
              />
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-white/45">
              <CreditCard className="size-3.5" /> Secure hosted checkout by Dodo Payments
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
