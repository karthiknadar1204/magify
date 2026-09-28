import "server-only";

import { eq } from "drizzle-orm";

import { db } from "./index";
import { users } from "./schema";

type UserIdentity = {
  clerkUserId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};

export async function ensureUser(identity: UserIdentity) {
  const [user] = await db
    .insert(users)
    .values(identity)
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: {
        email: identity.email,
        name: identity.name,
        imageUrl: identity.imageUrl,
        updatedAt: new Date(),
      },
    })
    .returning();

  return user;
}

export async function getUserByClerkId(clerkUserId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  return user ?? null;
}
