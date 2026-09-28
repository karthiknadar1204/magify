import Link from "next/link";

import { LogoMark } from "@/components/logo-mark";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 font-semibold tracking-[-0.045em]",
        className,
      )}
      aria-label="Magnify home"
    >
      <LogoMark className="size-9 drop-shadow-sm transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105" />
      <span className="text-xl">
        magni<span className="text-primary">f</span>y
      </span>
    </Link>
  );
}
