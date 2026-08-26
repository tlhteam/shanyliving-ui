import { AppCard } from "@/components/app/AppCard";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminEditorSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="pb-24">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Skeleton className="size-9 shrink-0" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-56" />
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Skeleton className="h-10 flex-1 sm:w-24 sm:flex-none" />
          <Skeleton className="h-10 flex-1 sm:w-24 sm:flex-none" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <AppCard className="min-w-0 space-y-4 p-4 sm:p-6">
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-16 rounded-full" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </AppCard>
        <div className="space-y-5">
          <AppCard className="space-y-3 p-4 sm:p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-10 w-32" />
          </AppCard>
          <AppCard className="space-y-3 p-4 sm:p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </AppCard>
        </div>
      </div>
    </div>
  );
}
