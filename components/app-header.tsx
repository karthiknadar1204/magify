"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Coins, CreditCard, History, Plus } from "lucide-react";

import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import {
  CREDITS_UPDATED_EVENT,
  type CreditsUpdatedDetail,
} from "@/lib/credit-events";
import { cn } from "@/lib/utils";

export function AppHeader({
  credits,
  subscriptionStatus,
}: {
  credits: number;
  subscriptionStatus: string;
}) {
  const [visibleCredits, setVisibleCredits] = useState(credits);

  useEffect(() => {
    function handleCreditsUpdated(event: Event) {
      const detail = (event as CustomEvent<CreditsUpdatedDetail>).detail;

      if (Number.isInteger(detail?.credits) && detail.credits >= 0) {
        setVisibleCredits(detail.credits);
      }
    }

    window.addEventListener(CREDITS_UPDATED_EVENT, handleCreditsUpdated);
    return () =>
      window.removeEventListener(CREDITS_UPDATED_EVENT, handleCreditsUpdated);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/8 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <Brand />
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 rounded-full px-3 text-muted-foreground",
              )}
            >
              <History /> History
            </Link>
            <Link
              href="/billing"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 rounded-full px-3 text-muted-foreground",
              )}
            >
              <CreditCard /> Billing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent/55 px-3 py-1.5 text-xs font-medium text-accent-foreground transition hover:bg-accent"
            aria-label={`${visibleCredits} image credits. Open billing.`}
          >
            <Coins className="size-3.5" /> {visibleCredits}
            <span className="hidden sm:inline">
              {subscriptionStatus === "active" ? "credits" : "free credits"}
            </span>
          </Link>
          <Link
            href="/create"
            className={cn(
              buttonVariants(),
              "h-10 rounded-full px-4 shadow-sm",
            )}
          >
            <Plus /> New edit
          </Link>
          <UserButton
            appearance={{
              elements: { avatarBox: "size-9" },
            }}
          />
        </div>
      </div>
    </header>
  );
}
