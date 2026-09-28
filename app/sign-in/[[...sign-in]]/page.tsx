import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { Brand } from "@/components/brand";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[.82fr_1.18fr]">
      <section className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col">
        <Brand className="relative z-10 text-background" />
        <div className="relative z-10 my-auto max-w-lg">
          <p className="text-sm font-semibold tracking-[0.16em] text-accent uppercase">
            Your private AI photo studio
          </p>
          <h1 className="mt-5 text-6xl font-semibold leading-[.96] tracking-[-0.06em]">
            Make it polished. Keep it yours.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/60">
            Five focused editing tools, one uncomplicated workflow, and a private history of every result.
          </p>
        </div>
        <div className="absolute -bottom-40 -right-32 size-[34rem] rounded-full bg-primary/70 blur-3xl" />
        <div className="absolute -left-24 top-1/3 size-72 rounded-full bg-accent/20 blur-3xl" />
      </section>
      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
        <Link href="/" className="mb-8 lg:hidden">
          <Brand />
        </Link>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
        />
      </main>
    </div>
  );
}
