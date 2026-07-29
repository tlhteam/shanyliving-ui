import { cn } from "@/lib/utils";

export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-neutral-200 bg-[linear-gradient(135deg,#f7f3ec,#e4ddd2_48%,#f7f7f5)]",
        className
      )}
    />
  );
}
