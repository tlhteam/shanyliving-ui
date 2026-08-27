"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppImage } from "@/components/app/AppImage";
import { SofaVectorSofa } from "@/components/sofa/SofaVectorSofa";
import { useOptionLabel } from "@/hooks/use-option-label";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

type SofaLayeredPreviewProps = {
  alt: string;
  baseImage: string;
  maskImage?: string | null;
  fabricImage?: string | null;
  fabricLabel?: string | null;
  colorSwatch?: string | null;
  colorLabel?: string | null;
  sizeLabel?: string | null;
  widthRatio?: number;
  widthMetres?: number;
  mirrored?: boolean;
  compact?: boolean;
  vector?: boolean;
  className?: string;
};

export function metresFor(sizeLabel?: string | null) {
  const match = String(sizeLabel ?? "").match(/(\d+(?:[.,]\d+)?)/);
  const value = match ? Number(match[1].replace(",", ".")) : null;

  return value && value > 0 ? value : 2.4;
}

export function widthRatioFor(sizeLabel: string | undefined, sizes: string[]) {
  const parse = (value: string) => {
    const match = value.match(/(\d+(?:[.,]\d+)?)/);

    return match ? Number(match[1].replace(",", ".")) : null;
  };

  const current = parse(sizeLabel ?? "");
  const numeric = sizes.map(parse).filter((value): value is number => value !== null);

  if (current === null || numeric.length < 2) {
    return 1;
  }

  const min = Math.min(...numeric);
  const max = Math.max(...numeric);

  if (max === min) {
    return 1;
  }

  return 0.72 + ((current - min) / (max - min)) * 0.28;
}

export function SofaLayeredPreview({
  alt,
  baseImage,
  maskImage,
  fabricImage,
  fabricLabel,
  colorSwatch,
  colorLabel,
  sizeLabel,
  widthRatio = 1,
  widthMetres,
  mirrored = false,
  compact = false,
  vector = false,
  className
}: SofaLayeredPreviewProps) {
  const t = useTranslations("customizer");
  const optionLabel = useOptionLabel();
  const [drawing, setDrawing] = useState(vector);
  const mask = mediaUrl(maskImage ?? undefined);
  const fabric = mediaUrl(fabricImage ?? undefined);
  const maskStyle = mask
    ? {
        maskImage: `url(${mask})`,
        WebkitMaskImage: `url(${mask})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center"
      }
    : undefined;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-neutral-200 bg-linear-to-b from-neutral-50 to-neutral-100 dark:border-white/10 dark:from-neutral-900 dark:to-neutral-950",
        className
      )}
    >
      <div className={cn("relative", compact ? "aspect-[1.6/1]" : "aspect-[1.35/1]")}>
        <div
          aria-hidden
          className="absolute inset-x-[12%] bottom-[14%] h-6 rounded-[50%] bg-neutral-900/10 blur-xl dark:bg-black/50"
        />

        {drawing ? (
          <div className="absolute inset-0 p-3 text-neutral-900 dark:text-black">
            <SofaVectorSofa
              title={alt}
              widthMetres={widthMetres ?? 2.4}
              chaiseSide={mirrored ? "end" : "start"}
              fabricImage={fabric}
              colorSwatch={colorSwatch}
            />
          </div>
        ) : (
          <div className="absolute inset-0 p-3">
            <div className="relative h-full w-full">
              <AppImage
                src={baseImage}
                alt={alt}
                className="absolute inset-0 bg-transparent"
                sizes="(max-width: 1024px) 92vw, 820px"
                imageClassName="object-contain"
              />

              {mask && fabric ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-45 mix-blend-multiply"
                  style={{ ...maskStyle, backgroundImage: `url(${fabric})`, backgroundSize: "220px" }}
                />
              ) : null}

              {mask && colorSwatch ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-60 mix-blend-color"
                  style={{ ...maskStyle, backgroundColor: colorSwatch }}
                />
              ) : null}
            </div>
          </div>
        )}

        {baseImage ? (
          <div className="absolute top-3 end-3 flex rounded-full border border-neutral-200 bg-white/90 p-0.5 shadow-[var(--shadow-elevation-1)] backdrop-blur dark:border-white/15 dark:bg-neutral-900/90">
            {[
              { key: "drawing", label: t("previewDrawing"), active: drawing },
              { key: "photo", label: t("previewPhoto"), active: !drawing }
            ].map((mode) => (
              <button
                key={mode.key}
                type="button"
                onClick={() => setDrawing(mode.key === "drawing")}
                aria-pressed={mode.active}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-bold transition",
                  mode.active
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
        ) : null}

        {fabric ? (
          <div className="absolute bottom-3 start-3 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/90 p-1.5 pe-3 shadow-[var(--shadow-elevation-1)] backdrop-blur dark:border-white/15 dark:bg-neutral-900/90">
            <AppImage src={fabric} alt="" className="size-9 rounded-md" sizes="36px" />
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                {optionLabel("Fabric")}
              </span>
              <span className="block truncate text-xs font-bold">{optionLabel(fabricLabel ?? "")}</span>
            </span>
          </div>
        ) : null}

        {colorSwatch || colorLabel ? (
          <div className="absolute bottom-3 end-3 flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 py-1.5 pe-3 ps-1.5 shadow-[var(--shadow-elevation-1)] backdrop-blur dark:border-white/15 dark:bg-neutral-900/90">
            <span
              className="size-6 rounded-full border border-neutral-300 dark:border-white/20"
              style={colorSwatch ? { backgroundColor: colorSwatch } : undefined}
            />
            <span className="text-xs font-bold">{optionLabel(colorLabel ?? "")}</span>
          </div>
        ) : null}
      </div>

      {sizeLabel ? (
        <div className="border-t border-neutral-200 px-4 py-2.5 dark:border-white/10">
          <div className="mx-auto flex items-center gap-2" style={{ width: `${Math.round(widthRatio * 100)}%` }}>
            <span aria-hidden className="h-2.5 w-px bg-neutral-400 dark:bg-white/40" />
            <span aria-hidden className="h-px flex-1 bg-neutral-300 dark:bg-white/20" />
            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
              {t("previewWidth", { size: sizeLabel })}
            </span>
            <span aria-hidden className="h-px flex-1 bg-neutral-300 dark:bg-white/20" />
            <span aria-hidden className="h-2.5 w-px bg-neutral-400 dark:bg-white/40" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
