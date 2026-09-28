import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "./index";
import { generations, type NewGeneration } from "./schema";

export async function createGeneration(value: NewGeneration) {
  const [generation] = await db.insert(generations).values(value).returning();
  return generation;
}

export async function markGenerationProcessing(id: string) {
  const [generation] = await db
    .update(generations)
    .set({ status: "processing", startedAt: new Date() })
    .where(eq(generations.id, id))
    .returning();

  return generation;
}

export async function markGenerationComplete(
  id: string,
  result: {
    resultKey: string;
    previewKey: string;
    resultMimeType: string;
    outputWidth: number | null;
    outputHeight: number | null;
  },
) {
  const [generation] = await db
    .update(generations)
    .set({
      ...result,
      status: "completed",
      completedAt: new Date(),
      errorCode: null,
      errorMessage: null,
    })
    .where(eq(generations.id, id))
    .returning();

  return generation;
}

export async function markGenerationFailed(
  id: string,
  error: { code: string; message: string },
) {
  const [generation] = await db
    .update(generations)
    .set({
      status: "failed",
      errorCode: error.code,
      errorMessage: error.message,
      completedAt: new Date(),
    })
    .where(eq(generations.id, id))
    .returning();

  return generation;
}

export async function listGenerationsForUser(userId: string, limit = 24) {
  return db
    .select()
    .from(generations)
    .where(
      and(eq(generations.userId, userId), isNull(generations.deletedAt)),
    )
    .orderBy(desc(generations.createdAt))
    .limit(Math.min(Math.max(limit, 1), 50));
}

export async function getGenerationForUser(id: string, userId: string) {
  const [generation] = await db
    .select()
    .from(generations)
    .where(
      and(
        eq(generations.id, id),
        eq(generations.userId, userId),
        isNull(generations.deletedAt),
      ),
    )
    .limit(1);

  return generation ?? null;
}

export async function softDeleteGeneration(id: string, userId: string) {
  const [generation] = await db
    .update(generations)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(generations.id, id),
        eq(generations.userId, userId),
        isNull(generations.deletedAt),
      ),
    )
    .returning();

  return generation ?? null;
}
