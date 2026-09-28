import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="Magnify"
      className={cn("size-10 shrink-0", className)}
    >
      <rect width="40" height="40" rx="13" fill="var(--primary)" />
      <path
        d="M10.5 28V14.75c0-1.16 1.4-1.74 2.22-.92L20 21.1l7.28-7.27c.82-.82 2.22-.24 2.22.92V28"
        fill="none"
        stroke="white"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="9.5" r="3.5" fill="var(--accent)" />
      <circle cx="30" cy="9.5" r="1.25" fill="var(--accent-foreground)" opacity=".7" />
    </svg>
  );
}
