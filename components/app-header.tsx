import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { History, Plus } from "lucide-react";

import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppHeader() {
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
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-accent/55 px-3 py-1.5 text-xs font-medium text-accent-foreground sm:inline-flex">
            Private beta · free testing
          </span>
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
