import {
  getGenerationForUser,
  softDeleteGeneration,
} from "@/db/generations";
import { getAuthenticatedAppUser } from "@/lib/auth";
import { deleteMedia } from "@/lib/storage";

export const runtime = "nodejs";

type GenerationRouteContext = {
  params: Promise<{ id: string }>;
};

function serializeGeneration(
  generation: NonNullable<
    Awaited<ReturnType<typeof getGenerationForUser>>
  >,
) {
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

export async function GET(_: Request, context: GenerationRouteContext) {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const generation = await getGenerationForUser(id, user.id);

  if (!generation) {
    return Response.json({ error: "Generation not found" }, { status: 404 });
  }

  return Response.json({ generation: serializeGeneration(generation) });
}

export async function DELETE(_: Request, context: GenerationRouteContext) {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const generation = await softDeleteGeneration(id, user.id);

  if (!generation) {
    return Response.json({ error: "Generation not found" }, { status: 404 });
  }

  const mediaKeys = [
    generation.originalKey,
    generation.previewKey,
    generation.resultKey,
  ].filter((key): key is string => Boolean(key));

  await Promise.all(mediaKeys.map((key) => deleteMedia(key))).catch(
    () => undefined,
  );

  return Response.json({ deleted: true });
}
