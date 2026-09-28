import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppNotFound() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-5 py-16 text-center">
      <div>
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">Not found</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">That edit is not here.</h1>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">
          It may have been deleted, or it belongs to a different account.
        </p>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ size: "lg" }), "mt-7 h-12 rounded-full px-5")}
        >
          <ArrowLeft /> Back to your edits
        </Link>
      </div>
    </div>
  );
}
