import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/8 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Brand />

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#tools">
            Tools
          </a>
          <a className="transition-colors hover:text-foreground" href="#how-it-works">
            How it works
          </a>
          <a className="transition-colors hover:text-foreground" href="#privacy">
            Privacy
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "hidden sm:inline-flex",
                )}
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 rounded-full px-4 shadow-sm",
                )}
              >
                Try Magnify
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-10 rounded-full px-4",
              )}
            >
              Open app
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
