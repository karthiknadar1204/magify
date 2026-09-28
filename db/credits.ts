import "server-only";

import { and, eq, gt, sql } from "drizzle-orm";

import { db } from "./index";
import { creditTransactions, users } from "./schema";

export async function consumeGenerationCredit(
  userId: string,
  generationId: string,
) {
  return db.transaction(async (tx) => {
    const [updatedUser] = await tx
      .update(users)
      .set({
        credits: sql`${users.credits} - 1`,
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, userId), gt(users.credits, 0)))
      .returning({ credits: users.credits });

    if (!updatedUser) {
      return null;
    }

    await tx.insert(creditTransactions).values({
      userId,
      generationId,
      amount: -1,
      kind: "generation_charge",
    });

    return updatedUser.credits;
  });
}

export async function refundGenerationCredit(
  userId: string,
  generationId: string,
) {
  return db.transaction(async (tx) => {
    const [refund] = await tx
      .insert(creditTransactions)
      .values({
        userId,
        generationId,
        amount: 1,
        kind: "generation_refund",
      })
      .onConflictDoNothing({
        target: [creditTransactions.kind, creditTransactions.generationId],
      })
      .returning({ id: creditTransactions.id });

    if (!refund) {
      return false;
    }

    await tx
      .update(users)
      .set({
        credits: sql`${users.credits} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return true;
  });
}
