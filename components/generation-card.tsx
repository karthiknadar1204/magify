import Link from "next/link";
import { ArrowUpRight, CircleAlert, LoaderCircle } from "lucide-react";

import type { Generation } from "@/db/schema";
import { modePresets, type EditMode } from "@/lib/image-presets";

function getModeLabel(mode: string) {
  return modePresets[mode as EditMode]?.shortLabel ?? "Edit";
}

export function GenerationCard({ generation }: { generation: Generation }) {
  const isComplete = generation.status === "completed";
  const isFailed = generation.status === "failed";

  return (
    <Link
      href={`/result/${generation.id}`}
      className="group overflow-hidden rounded-3xl border border-foreground/8 bg-card/80 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/6"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {isComplete ? (
          // Private media is served through an authenticated route.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/media/${generation.id}/preview`}
            alt={`${getModeLabel(generation.mode)} result`}
            className="size-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="grid size-full place-items-center">
            <span className="grid size-12 place-items-center rounded-full bg-background shadow-sm">
              {isFailed ? (
                <CircleAlert className="size-5 text-destructive" />
              ) : (
                <LoaderCircle className="size-5 animate-spin text-primary" />
              )}
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
          {getModeLabel(generation.mode)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{generation.originalName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(generation.createdAt)}
          </p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
