import { getGenerationForUser } from "@/db/generations";
import { getAuthenticatedAppUser } from "@/lib/auth";
import { readMedia } from "@/lib/storage";

export const runtime = "nodejs";

type MediaRouteContext = {
  params: Promise<{ id: string; kind: string }>;
};

export async function GET(_: Request, context: MediaRouteContext) {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id, kind } = await context.params;
  const generation = await getGenerationForUser(id, user.id);

  if (!generation) {
    return new Response("Not found", { status: 404 });
  }

  const media = {
    original: {
      key: generation.originalKey,
      type: generation.originalMimeType,
      disposition: "inline",
    },
    preview: {
      key: generation.previewKey,
      type: generation.resultMimeType,
      disposition: "inline",
    },
    result: {
      key: generation.resultKey,
      type: generation.resultMimeType,
      disposition: 'attachment; filename="magify-result.webp"',
    },
  }[kind];

  if (!media?.key) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const body = await readMedia(media.key);

    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": media.type || "image/webp",
        "Content-Disposition": media.disposition,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
