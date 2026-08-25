"use client";

import { useState } from "react";

type BlockView = "top" | "front" | "left" | "right";

const viewOptions: Array<{ key: BlockView; label: string }> = [
  { key: "top", label: "Top" },
  { key: "front", label: "Front" },
  { key: "left", label: "Left" },
  { key: "right", label: "Right" }
];

const blockClass = "rounded-md border border-black/10 shadow-sm dark:border-black/30";

type Layout = "chaise-left" | "chaise-right" | "straight";

function resolveLayout(configuration: string): Layout {
  if (configuration === "Left chaise") {
    return "chaise-left";
  }

  if (configuration === "Right chaise" || configuration === "Sectional") {
    return "chaise-right";
  }

  return "straight";
}

function TopView({ layout, color }: { layout: Layout; color: string }) {
  return (
    <div className="relative h-24 w-52 sm:h-28 sm:w-60">
      <div className="absolute inset-x-0 top-0 flex h-12 gap-1 sm:h-14">
        {[0, 1, 2].map((segment) => (
          <div key={segment} className={`flex-1 ${blockClass}`} style={{ backgroundColor: color }} />
        ))}
      </div>
      {layout !== "straight" ? (
        <div
          className={`absolute top-12 h-12 w-1/3 sm:top-14 sm:h-14 ${blockClass}`}
          style={{ backgroundColor: color, [layout === "chaise-left" ? "left" : "right"]: 0 }}
        />
      ) : null}
    </div>
  );
}

function FrontView({ color }: { color: string }) {
  return (
    <div className="flex h-20 w-56 items-end gap-1.5 sm:h-24 sm:w-64">
      <div className={`h-14 w-8 sm:h-16 ${blockClass}`} style={{ backgroundColor: color }} />
      <div className={`h-20 flex-1 sm:h-24 ${blockClass}`} style={{ backgroundColor: color }} />
      <div className={`h-14 w-8 sm:h-16 ${blockClass}`} style={{ backgroundColor: color }} />
    </div>
  );
}

function SideView({ mirrored, color }: { mirrored: boolean; color: string }) {
  return (
    <div className={`flex h-20 w-36 items-end sm:h-24 sm:w-40 ${mirrored ? "flex-row-reverse" : ""}`}>
      <div className={`h-20 w-10 sm:h-24 ${blockClass}`} style={{ backgroundColor: color }} />
      <div className={`h-10 flex-1 sm:h-12 ${blockClass}`} style={{ backgroundColor: color }} />
    </div>
  );
}

export function SofaBlockDiagram({
  configuration,
  color,
  className
}: {
  configuration: string;
  color: string;
  className?: string;
}) {
  const [view, setView] = useState<BlockView>("top");
  const layout = resolveLayout(configuration);

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {viewOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setView(option.key)}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
              view === option.key
                ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-white/15 dark:text-neutral-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid aspect-[1.4/1] place-items-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900">
        {view === "top" ? <TopView layout={layout} color={color} /> : null}
        {view === "front" ? <FrontView color={color} /> : null}
        {view === "left" ? <SideView mirrored={false} color={color} /> : null}
        {view === "right" ? <SideView mirrored color={color} /> : null}
      </div>
    </div>
  );
}
