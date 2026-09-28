"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  ImageIcon,
  ImagePlus,
  LoaderCircle,
  MessageSquareText,
  ScanFace,
  Sparkles,
  UploadCloud,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  aspectRatios,
  modePresets,
  strengths,
  type AspectRatio,
  type EditMode,
  type EditStrength,
} from "@/lib/image-presets";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const modeIcons: Record<EditMode, typeof Sparkles> = {
  enhance: Sparkles,
  headshot: ScanFace,
  product: Box,
  restore: ImageIcon,
  custom: MessageSquareText,
};

const strengthLabels: Record<EditStrength, { label: string; description: string }> = {
  subtle: { label: "Subtle", description: "Very close to the original" },
  balanced: { label: "Balanced", description: "Polished and believable" },
  strong: { label: "Strong", description: "A confident transformation" },
};

const ratioLabels: Record<AspectRatio, string> = {
  original: "Original",
  square: "Square",
  portrait: "Portrait",
  landscape: "Landscape",
};

type GenerationResponse = {
  generation?: { id: string };
  error?: string;
};

export function ImageEditor() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  const [mode, setMode] = useState<EditMode>("enhance");
  const [style, setStyle] = useState(modePresets.enhance.styles[0].id);
  const [strength, setStrength] = useState<EditStrength>("balanced");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("original");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!isSubmitting) return;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 88) return current;
        return current + Math.max(1, Math.round((90 - current) / 10));
      });
    }, 900);

    return () => window.clearInterval(timer);
  }, [isSubmitting]);

  function chooseMode(nextMode: EditMode) {
    setMode(nextMode);
    setStyle(modePresets[nextMode].styles[0].id);
  }

  function acceptFile(nextFile: File | undefined) {
    if (!nextFile) return;

    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      toast.error("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      toast.error("Choose an image smaller than 12 MB.");
      return;
    }

    setFile(nextFile);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      toast.error("Choose a photo first.");
      fileInputRef.current?.click();
      return;
    }

    if (mode === "custom" && !customPrompt.trim()) {
      toast.error("Describe the edit you want.");
      return;
    }

    const formData = new FormData();
    formData.set("image", file);
    formData.set("mode", mode);
    formData.set("style", style);
    formData.set("strength", strength);
    formData.set("aspectRatio", aspectRatio);
    if (customPrompt.trim()) formData.set("customPrompt", customPrompt.trim());

    setIsSubmitting(true);
    setProgress(8);

    try {
      const response = await fetch("/api/generations", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as GenerationResponse;

      if (!response.ok || !payload.generation) {
        throw new Error(payload.error || "The edit could not be completed.");
      }

      setProgress(100);
      toast.success("Your edit is ready.");
      router.push(`/result/${payload.generation.id}`);
    } catch (error) {
      setIsSubmitting(false);
      setProgress(0);
      toast.error(
        error instanceof Error ? error.message : "The edit could not be completed.",
      );
    }
  }

  const currentMode = modePresets[mode];

  return (
    <form onSubmit={handleSubmit} className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      <section className="rounded-[2rem] border border-foreground/8 bg-card/75 p-4 shadow-sm sm:p-6">
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            acceptFile(event.dataTransfer.files[0]);
          }}
          className={cn(
            "relative flex min-h-[29rem] overflow-hidden rounded-[1.5rem] border-2 border-dashed transition sm:min-h-[36rem]",
            isDragging
              ? "border-primary bg-primary/6"
              : "border-foreground/12 bg-muted/35",
          )}
        >
          {previewUrl ? (
            <>
              {/* The preview is a short-lived local object URL. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected upload preview"
                className="absolute inset-0 size-full object-contain p-3"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/25 bg-foreground/80 p-3 text-background shadow-xl backdrop-blur-lg">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file?.name}</p>
                  <p className="mt-0.5 text-xs text-white/60">
                    {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : null}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full bg-white/12 text-white hover:bg-white/20"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    aria-label="Remove selected image"
                    className="rounded-full bg-white/12 text-white hover:bg-white/20"
                    onClick={() => setFile(null)}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="flex size-full min-h-[29rem] flex-col items-center justify-center px-6 text-center sm:min-h-[36rem]"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="grid size-16 place-items-center rounded-3xl bg-background text-primary shadow-sm">
                <UploadCloud className="size-7" />
              </span>
              <span className="mt-6 text-xl font-semibold tracking-[-0.025em]">
                Drop your photo here
              </span>
              <span className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                or click to browse · JPG, PNG, or WebP · up to 12 MB
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onClick={(event) => {
              event.currentTarget.value = "";
            }}
            onChange={(event) => acceptFile(event.target.files?.[0])}
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-foreground/8 bg-card/75 p-5 shadow-sm sm:p-7">
        <fieldset disabled={isSubmitting} className="space-y-8">
          <div>
            <legend className="text-sm font-semibold">1. Choose a tool</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5">
              {(Object.keys(modePresets) as EditMode[]).map((candidate) => {
                const Icon = modeIcons[candidate];
                const preset = modePresets[candidate];
                const active = candidate === mode;

                return (
                  <button
                    key={candidate}
                    type="button"
                    onClick={() => chooseMode(candidate)}
                    className={cn(
                      "flex min-h-24 flex-col items-start justify-between rounded-2xl border p-3 text-left transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/12"
                        : "border-foreground/10 bg-background/70 hover:border-primary/35 hover:bg-background",
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="text-xs font-semibold">{preset.shortLabel}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {currentMode.description}
            </p>
          </div>

          <div>
            <legend className="text-sm font-semibold">2. Pick the finish</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {currentMode.styles.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => setStyle(candidate.id)}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition",
                    style === candidate.id
                      ? "border-primary bg-primary/7 ring-2 ring-primary/10"
                      : "border-foreground/10 bg-background/60 hover:border-primary/30",
                  )}
                >
                  <span className="block text-sm font-semibold">{candidate.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {candidate.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {mode === "custom" ? (
            <div>
              <label htmlFor="custom-prompt" className="text-sm font-semibold">
                Describe the exact change
              </label>
              <Textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(event) => setCustomPrompt(event.target.value)}
                maxLength={600}
                rows={4}
                placeholder="For example: remove the people in the background and make the light feel like golden hour."
                className="mt-3 min-h-28 resize-none rounded-2xl bg-background/70 p-3"
              />
              <p className="mt-2 text-right text-xs text-muted-foreground">
                {customPrompt.length}/600
              </p>
            </div>
          ) : null}

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <legend className="text-sm font-semibold">3. Edit strength</legend>
              <div className="mt-3 space-y-2">
                {strengths.map((candidate) => (
                  <button
                    key={candidate}
                    type="button"
                    onClick={() => setStrength(candidate)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition",
                      strength === candidate
                        ? "border-primary bg-primary/7"
                        : "border-foreground/10 bg-background/60",
                    )}
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        {strengthLabels[candidate].label}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {strengthLabels[candidate].description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "size-3.5 rounded-full border",
                        strength === candidate
                          ? "border-primary bg-primary shadow-[inset_0_0_0_3px_white]"
                          : "border-foreground/25",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <legend className="text-sm font-semibold">4. Shape</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {aspectRatios.map((candidate) => (
                  <button
                    key={candidate}
                    type="button"
                    onClick={() => setAspectRatio(candidate)}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-sm font-medium transition",
                      aspectRatio === candidate
                        ? "border-primary bg-primary/7 text-primary"
                        : "border-foreground/10 bg-background/60",
                    )}
                  >
                    {ratioLabels[candidate]}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Original keeps the source shape. Other shapes may crop the edges.
              </p>
            </div>
          </div>
        </fieldset>

        {isSubmitting ? (
          <div className="mt-8 rounded-2xl bg-primary/7 p-4">
            <div className="flex items-center gap-3">
              <LoaderCircle className="size-4 animate-spin text-primary" />
              <div>
                <p className="text-sm font-semibold">Magnifying your photo…</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Keep this page open. A detailed edit can take about a minute.
                </p>
              </div>
            </div>
            <Progress value={progress} className="mt-4" />
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-8 h-13 w-full rounded-full text-base shadow-lg shadow-primary/15"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" /> Working…
            </>
          ) : (
            <>
              <WandSparkles /> Magnify this photo
            </>
          )}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ImagePlus className="size-3.5" /> Free during private beta · no card required
        </p>
      </section>
    </form>
  );
}
