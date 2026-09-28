import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Box,
  Check,
  ImageIcon,
  LockKeyhole,
  MessageSquareText,
  ScanFace,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { BeforeAfter } from "@/components/before-after";
import { Brand } from "@/components/brand";
import { MarketingHeader } from "@/components/marketing-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tools = [
  {
    icon: Sparkles,
    title: "Photo enhancer",
    description: "Natural light, colour, clarity, and detail—without the crunchy HDR look.",
    accent: "bg-violet-100 text-violet-700",
  },
  {
    icon: ScanFace,
    title: "Professional headshot",
    description: "Studio-quality portraits that preserve the person people already recognise.",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    icon: Box,
    title: "Product studio",
    description: "Turn an ordinary product photo into a clean listing or premium campaign.",
    accent: "bg-sky-100 text-sky-700",
  },
  {
    icon: ImageIcon,
    title: "Old photo restore",
    description: "Repair scratches and fading, with optional historically plausible colour.",
    accent: "bg-rose-100 text-rose-700",
  },
  {
    icon: MessageSquareText,
    title: "Custom edit",
    description: "Say exactly what should change. Everything else stays where it belongs.",
    accent: "bg-emerald-100 text-emerald-700",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <MarketingHeader />

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:pb-28 lg:pt-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card/70 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" />
              Private beta is open · no card required
            </div>

            <h1 className="text-balance max-w-2xl text-[clamp(3.35rem,7vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
              Every photo,
              <span className="relative mt-2 block w-fit text-primary">
                finally finished.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 420 20"
                  className="absolute -bottom-3 left-0 w-full text-accent-foreground/45"
                >
                  <path
                    d="M4 13C109 2 261 3 416 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-9 max-w-xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl">
              Enhance portraits, products, and old memories with precise AI editing that keeps the important parts unmistakably yours.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-13 rounded-full px-6 text-base shadow-lg shadow-primary/15",
                    )}
                  >
                    Magify your first photo <ArrowRight />
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/create"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-13 rounded-full px-6 text-base shadow-lg shadow-primary/15",
                  )}
                >
                  Magify a photo <ArrowRight />
                </Link>
              </Show>
              <a
                href="#tools"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-13 rounded-full border-foreground/12 bg-card/60 px-6 text-base",
                )}
              >
                Explore the tools
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {["Five focused tools", "Private by default", "Delete anytime"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-accent/70 text-accent-foreground">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative lg:pl-2">
            <div className="absolute -inset-12 -z-10 rounded-full bg-primary/10 blur-3xl" />
            <div className="rotate-[1.2deg] overflow-hidden rounded-[2rem] border border-white/65 bg-card p-2.5 shadow-[0_35px_100px_-45px_rgba(37,25,65,.55)]">
              <BeforeAfter
                beforeSrc="/magify-showcase.png"
                afterSrc="/magify-showcase.png"
                beforeAlt="Portrait before enhancement"
                afterAlt="Portrait after enhancement"
                filteredBefore
                className="aspect-[1.36/1] rounded-[1.45rem]"
              />
              <div className="flex items-center justify-between px-3 pb-1 pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <WandSparkles className="size-3.5 text-primary" /> Natural enhance
                </span>
                <span>Drag to compare</span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden -rotate-3 rounded-2xl border border-foreground/8 bg-accent px-5 py-4 shadow-xl sm:block">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-accent-foreground/70 uppercase">
                The brief
              </p>
              <p className="mt-1.5 max-w-44 text-sm font-medium leading-5 text-accent-foreground">
                “Polished, still completely me.”
              </p>
            </div>
          </div>
        </section>

        <section id="tools" className="border-y border-foreground/8 bg-card/55 py-22 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">Five focused tools</p>
              <h2 className="text-balance mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Choose an outcome, not a hundred confusing controls.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {tools.map((tool, index) => (
                <article
                  key={tool.title}
                  className={cn(
                    "group rounded-3xl border border-foreground/8 bg-background/70 p-5 transition duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-xl hover:shadow-foreground/5",
                    index === 4 && "sm:col-span-2 lg:col-span-1",
                  )}
                >
                  <span className={cn("grid size-11 place-items-center rounded-2xl", tool.accent)}>
                    <tool.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">How it works</p>
              <h2 className="text-balance mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                From camera roll to ready-to-use.
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Magify asks only for the decisions that materially improve your result. The complicated prompt work happens quietly behind the scenes.
              </p>
            </div>

            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Upload", "Drop in a JPG, PNG, or WebP. We prepare it without stretching or enlarging it."],
                ["02", "Direct", "Pick a tool, visual style, and how confidently you want Magify to edit."],
                ["03", "Compare", "Inspect the before and after, then download the clean WebP result."],
              ].map(([number, title, description]) => (
                <li key={number} className="surface-grid rounded-3xl border border-foreground/8 bg-card/65 p-6">
                  <span className="font-mono text-sm text-primary">{number}</span>
                  <h3 className="mt-14 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="privacy" className="mx-5 mb-8 overflow-hidden rounded-[2rem] bg-foreground text-background sm:mx-8 lg:rounded-[2.5rem]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-12 lg:grid-cols-[1fr_auto] lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">
                <LockKeyhole className="size-3.5" /> Private by design
              </span>
              <h2 className="text-balance mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Your photos are the input, never the product.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
                Originals and results stay private to your account. Delete any edit whenever you want—you stay in control of what remains.
              </p>
            </div>

            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "h-13 rounded-full bg-background px-6 text-base text-foreground hover:bg-background/90",
                  )}
                >
                  Start your first edit <ArrowRight />
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/create"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-13 rounded-full bg-background px-6 text-base text-foreground hover:bg-background/90",
                )}
              >
                Start a new edit <ArrowRight />
              </Link>
            </Show>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-9 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Brand className="text-foreground" />
        <p>Original visuals, precise edits, no fuss.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
