import { randomUUID } from "node:crypto";

import OpenAI from "openai";
import { ZodError } from "zod";

import {
  consumeGenerationCredit,
  refundGenerationCredit,
} from "@/db/credits";
import {
  createGeneration,
  listGenerationsForUser,
  markGenerationComplete,
  markGenerationFailed,
  markGenerationProcessing,
  softDeleteGeneration,
} from "@/db/generations";
import { getAuthenticatedAppUser } from "@/lib/auth";
import { generationInputSchema } from "@/lib/image-presets";
import {
  createResultPreview,
  getImageDimensions,
  ImageValidationError,
  normalizeUpload,
  validateUpload,
} from "@/lib/image-processing";
import { editImageWithOpenAI } from "@/lib/openai-image";
import { deleteMedia, putMedia } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 120;

function serializeGeneration(generation: Awaited<ReturnType<typeof createGeneration>>) {
  return {
    ...generation,
    originalUrl: `/api/media/${generation.id}/original`,
    previewUrl: generation.previewKey
      ? `/api/media/${generation.id}/preview`
      : null,
    resultUrl: generation.resultKey
      ? `/api/media/${generation.id}/result`
      : null,
  };
}

function getPublicError(error: unknown) {
  if (error instanceof ImageValidationError) {
    return { status: 400, code: "invalid_image", message: error.message };
  }

  if (error instanceof ZodError) {
    return {
      status: 400,
      code: "invalid_request",
      message: error.issues[0]?.message ?? "Check the editing options.",
    };
  }

  if (error instanceof OpenAI.APIError) {
    if (error.code === "moderation_blocked") {
      return {
        status: 422,
        code: "moderation_blocked",
        message:
          "This edit could not be processed. Try a different image or instruction.",
      };
    }

    if (
      error.code === "credit_balance_exhausted" ||
      error.code === "insufficient_quota"
    ) {
      return {
        status: 503,
        code: "ai_billing_unavailable",
        message: "AI editing is temporarily unavailable. Please try again later.",
      };
    }

    if (error.status === 429) {
      return {
        status: 429,
        code: "rate_limited",
        message: "Magnify is busy right now. Wait a moment and try again.",
      };
    }
  }

  return {
    status: 500,
    code: "generation_failed",
    message: "The edit could not be completed. Your original image is safe.",
  };
}

export async function GET(request: Request) {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestUrl = new URL(request.url);
  const requestedLimit = Number(requestUrl.searchParams.get("limit") ?? 24);
  const limit = Number.isFinite(requestedLimit) ? requestedLimit : 24;
  const items = await listGenerationsForUser(user.id, limit);

  return Response.json({ items: items.map(serializeGeneration) });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.credits <= 0) {
    return Response.json(
      {
        error: "You’re out of image credits. Upgrade to Magnify Pro to keep editing.",
        code: "credits_exhausted",
      },
      { status: 402 },
    );
  }

  let generationId: string | null = null;
  let creditReserved = false;

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      throw new ImageValidationError("Choose an image to edit.");
    }

    validateUpload(image);

    const input = generationInputSchema.parse({
      mode: formData.get("mode"),
      style: formData.get("style"),
      strength: formData.get("strength"),
      aspectRatio: formData.get("aspectRatio"),
      customPrompt: formData.get("customPrompt") || undefined,
    });

    const normalized = await normalizeUpload(
      Buffer.from(await image.arrayBuffer()),
    );
    generationId = randomUUID();

    const originalKey = `${user.id}/${generationId}/original.webp`;
    const resultKey = `${user.id}/${generationId}/result.webp`;
    const previewKey = `${user.id}/${generationId}/preview.webp`;

    await putMedia(originalKey, normalized.buffer, normalized.mimeType);

    try {
      await createGeneration({
        id: generationId,
        userId: user.id,
        mode: input.mode,
        style: input.style,
        strength: input.strength,
        aspectRatio: input.aspectRatio,
        customPrompt: input.customPrompt || null,
        status: "queued",
        originalKey,
        originalName: image.name || "uploaded-image",
        originalMimeType: normalized.mimeType,
      });
    } catch (error) {
      await deleteMedia(originalKey);
      throw error;
    }

    const remainingCredits = await consumeGenerationCredit(
      user.id,
      generationId,
    );

    if (remainingCredits === null) {
      await Promise.all([
        softDeleteGeneration(generationId, user.id),
        deleteMedia(originalKey),
      ]);

      return Response.json(
        {
          error: "You’re out of image credits. Upgrade to Magnify Pro to keep editing.",
          code: "credits_exhausted",
        },
        { status: 402 },
      );
    }

    creditReserved = true;

    await markGenerationProcessing(generationId);

    const resultBuffer = await editImageWithOpenAI(normalized.buffer, input);
    const [previewBuffer, dimensions] = await Promise.all([
      createResultPreview(resultBuffer),
      getImageDimensions(resultBuffer),
    ]);

    await Promise.all([
      putMedia(resultKey, resultBuffer, "image/webp"),
      putMedia(previewKey, previewBuffer, "image/webp"),
    ]);

    const generation = await markGenerationComplete(generationId, {
      resultKey,
      previewKey,
      resultMimeType: "image/webp",
      outputWidth: dimensions.width,
      outputHeight: dimensions.height,
    });

    return Response.json(
      {
        generation: serializeGeneration(generation),
        remainingCredits,
      },
      { status: 201 },
    );
  } catch (error) {
    const publicError = getPublicError(error);

    if (generationId) {
      await Promise.all([
        markGenerationFailed(generationId, {
          code: publicError.code,
          message: publicError.message,
        }).catch(() => undefined),
        creditReserved
          ? refundGenerationCredit(user.id, generationId).catch(() => false)
          : Promise.resolve(false),
      ]);
    }

    return Response.json(
      { error: publicError.message, code: publicError.code },
      { status: publicError.status },
    );
  }
}
