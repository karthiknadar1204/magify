import Link from "next/link";
import { ArrowRight, ImagePlus, Sparkles } from "lucide-react";

import { GenerationCard } from "@/components/generation-card";
import { buttonVariants } from "@/components/ui/button";
import { listGenerationsForUser } from "@/db/generations";
import { getAuthenticatedAppUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const metadata = { title: "Your edits" };

export default async function DashboardPage() {
  const user = await getAuthenticatedAppUser();
  const generations = user ? await listGenerationsForUser(user.id) : [];
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
            Your studio
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            {firstName ? `Good to see you, ${firstName}.` : "Your edits."}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Every original and finished image is visible only to your account.
          </p>
        </div>
        <Link
          href="/create"
          className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-5")}
        >
          <ImagePlus /> New edit
        </Link>
      </div>

      {user && user.credits === 0 ? (
        <section className="mt-8 flex flex-col gap-4 rounded-3xl border border-primary/15 bg-primary/7 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">You’ve used your available credits.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Magnify Pro includes 30 successful edits every month for $9.99.
            </p>
          </div>
          <Link
            href="/billing"
            className={cn(buttonVariants(), "shrink-0 rounded-full px-5")}
          >
            View Magnify Pro <ArrowRight />
          </Link>
        </section>
      ) : null}

      {generations.length > 0 ? (
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {generations.map((generation) => (
            <GenerationCard key={generation.id} generation={generation} />
          ))}
        </section>
      ) : (
        <section className="surface-grid mt-10 overflow-hidden rounded-[2rem] border border-foreground/8 bg-card/65 px-6 py-16 text-center sm:px-12 sm:py-24">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="size-6" />
          </span>
          <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
            Your first before-and-after belongs here.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Choose a focused editing tool and Magnify will handle the prompt engineering for you.
          </p>
          <Link
            href="/create"
            className={cn(buttonVariants({ size: "lg" }), "mt-7 h-12 rounded-full px-5")}
          >
            Magnify a photo <ArrowRight />
          </Link>
        </section>
      )}
    </div>
  );
}
