import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CircleAlert,
  Download,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { BeforeAfter } from "@/components/before-after";
import { DeleteGenerationButton } from "@/components/delete-generation-button";
import { buttonVariants } from "@/components/ui/button";
import { getGenerationForUser } from "@/db/generations";
import { getAuthenticatedAppUser } from "@/lib/auth";
import { modePresets, type EditMode } from "@/lib/image-presets";
import { cn } from "@/lib/utils";

type ResultPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = { title: "Your result" };

export default async function ResultPage({ params }: ResultPageProps) {
  const [{ id }, user] = await Promise.all([params, getAuthenticatedAppUser()]);
  if (!user) notFound();

  const generation = await getGenerationForUser(id, user.id);
  if (!generation) notFound();

  const preset = modePresets[generation.mode as EditMode];
  const style = preset?.styles.find((candidate) => candidate.id === generation.style);
  const isComplete = generation.status === "completed" && generation.previewKey;
  const isFailed = generation.status === "failed";

  return (
    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to your edits
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
            {preset?.label ?? "Photo edit"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            {isComplete ? "Your photo, finished." : isFailed ? "This edit needs another try." : "Your edit is processing."}
          </h1>
        </div>

        {isComplete ? (
          <div className="flex flex-wrap gap-2">
            <DeleteGenerationButton id={generation.id} />
            <a
              href={`/api/media/${generation.id}/result`}
              download="magnify-result.webp"
              className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-4")}
            >
              <Download /> Download WebP
            </a>
          </div>
        ) : null}
      </div>

      {isComplete ? (
        <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_19rem]">
          <section className="overflow-hidden rounded-[2rem] border border-foreground/8 bg-card p-2.5 shadow-[0_30px_90px_-50px_rgba(37,25,65,.55)]">
            <BeforeAfter
              beforeSrc={`/api/media/${generation.id}/original`}
              afterSrc={`/api/media/${generation.id}/preview`}
              beforeAlt="Original uploaded photo"
              afterAlt="Magnify edited result"
              className="min-h-[28rem] rounded-[1.45rem] sm:min-h-[38rem]"
            />
            <p className="px-3 pb-1 pt-3 text-center text-xs text-muted-foreground">
              Drag across the image to compare the original and result.
            </p>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-foreground/8 bg-card/80 p-5">
              <h2 className="text-sm font-semibold">Edit details</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Tool</dt>
                  <dd className="text-right font-medium">{preset?.shortLabel ?? generation.mode}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Finish</dt>
                  <dd className="text-right font-medium">{style?.label ?? generation.style}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Strength</dt>
                  <dd className="text-right font-medium capitalize">{generation.strength}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">Shape</dt>
                  <dd className="text-right font-medium capitalize">{generation.aspectRatio}</dd>
                </div>
                {generation.outputWidth && generation.outputHeight ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted-foreground">Result</dt>
                    <dd className="text-right font-medium">
                      {generation.outputWidth} × {generation.outputHeight}
                    </dd>
                  </div>
                ) : null}
              </dl>
              {generation.customPrompt ? (
                <div className="mt-5 border-t border-foreground/8 pt-5">
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    Your direction
                  </p>
                  <p className="mt-2 text-sm leading-6">“{generation.customPrompt}”</p>
                </div>
              ) : null}
            </div>

            <div className="rounded-3xl bg-foreground p-5 text-background">
              <LockKeyhole className="size-5 text-accent" />
              <h2 className="mt-4 font-semibold">Visible only to you</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                This original and result require your signed-in session. Delete them whenever you like.
              </p>
            </div>

            <Link
              href="/create"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 w-full rounded-full bg-card",
              )}
            >
              <ImagePlus /> Create another
            </Link>
          </aside>
        </div>
      ) : (
        <section className="surface-grid mt-9 rounded-[2rem] border border-foreground/8 bg-card/70 px-6 py-20 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-background shadow-sm">
            {isFailed ? (
              <CircleAlert className="size-6 text-destructive" />
            ) : (
              <LoaderCircle className="size-6 animate-spin text-primary" />
            )}
          </span>
          <h2 className="mt-6 text-xl font-semibold">
            {isFailed ? "The edit could not be completed." : "Still working on the details…"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {isFailed
              ? generation.errorMessage || "Your original is safe. Try again with the same or a different photo."
              : "Detailed image work can take about a minute. Return to your edits shortly to see the result."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <DeleteGenerationButton id={generation.id} />
            <Link
              href="/create"
              className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-4")}
            >
              Try a new edit
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
