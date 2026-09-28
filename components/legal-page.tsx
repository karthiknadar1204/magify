import Link from "next/link";

import { Brand } from "@/components/brand";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-foreground/8 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Brand />
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Back home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated {updated}</p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-[-0.025em]">{section.title}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-7 text-muted-foreground">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
