import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { getAuthenticatedAppUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      <AppHeader
        key={`${user.id}:${user.credits}:${user.subscriptionStatus}`}
        credits={user.credits}
        subscriptionStatus={user.subscriptionStatus}
      />
      <main>{children}</main>
    </div>
  );
}
