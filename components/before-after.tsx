"use client";

import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

import { cn } from "@/lib/utils";

type BeforeAfterProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
  filteredBefore?: boolean;
};

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className,
  filteredBefore = false,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(48);

  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden bg-muted select-none",
        className,
      )}
    >
      {/* Authenticated media endpoints need the browser session cookie. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden border-r border-white/90"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className={cn(
            "absolute inset-0 size-full max-w-none object-cover",
            filteredBefore &&
              "brightness-[.78] saturate-[.62] contrast-[.88] blur-[.35px]",
          )}
          style={{ width: `${10000 / position}%` }}
          draggable={false}
        />
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-md">
        Before
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-foreground uppercase backdrop-blur-md">
        Magified
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-foreground text-background shadow-xl">
          <ChevronsLeftRight className="size-4" />
        </span>
      </div>

      <input
        type="range"
        min="8"
        max="92"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-0 z-20 size-full cursor-ew-resize opacity-0"
        aria-label="Compare before and after image"
      />
    </div>
  );
}
