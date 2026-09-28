import Link from "next/link";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 font-semibold tracking-[-0.03em]",
        className,
      )}
      aria-label="Magify home"
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-foreground text-background shadow-sm transition-transform group-hover:-rotate-3 group-hover:scale-105">
        <Sparkles className="size-4.5" strokeWidth={2.2} />
        <span className="absolute -right-2 -top-2 size-4 rounded-full bg-accent" />
      </span>
      <span className="text-xl">magify</span>
    </Link>
  );
}
