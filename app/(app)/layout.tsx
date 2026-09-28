import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main>{children}</main>
    </div>
  );
}
