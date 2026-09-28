import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

import { getUserByClerkId, ensureUser } from "@/db/users";

export async function getAuthenticatedAppUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const existingUser = await getUserByClerkId(userId);

  if (existingUser) {
    return existingUser;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Your Clerk account does not have an email address.");
  }

  return ensureUser({
    clerkUserId: userId,
    email,
    name:
      clerkUser.fullName ??
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ??
      null,
    imageUrl: clerkUser.imageUrl ?? null,
  });
}
