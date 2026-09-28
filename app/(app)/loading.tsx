import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <Skeleton className="h-4 w-24 rounded-full" />
      <Skeleton className="mt-5 h-12 w-full max-w-xl rounded-2xl" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/3] rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
