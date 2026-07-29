"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AppTableSkeletonProps = {
  columns?: number;
  rows?: number;
  className?: string;
};

export function AppTableSkeleton({ columns = 5, rows = 5, className }: AppTableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-hidden", className)} aria-label="Loading table data">
      <div className="min-w-[720px]">
        <div className="grid border-b border-neutral-200 px-4 py-3 dark:border-white/10" style={{ gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`header-${index}`} className="h-3 w-20 bg-neutral-200 dark:bg-white/10" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid border-b border-neutral-100 px-4 py-4 last:border-b-0 dark:border-white/5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr))` }}>
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton key={`cell-${rowIndex}-${columnIndex}`} className={cn("h-4 bg-neutral-200 dark:bg-white/10", columnIndex % 3 === 0 ? "w-24" : columnIndex % 3 === 1 ? "w-32" : "w-16")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
