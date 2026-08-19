"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, GripVertical, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { cn } from "@/lib/utils";
import type { ProductOptionDraft, ProductVariantDraft } from "@/types/product";

type VariantEditorProps = {
  options: ProductOptionDraft[];
  variants: ProductVariantDraft[];
  onOptionsChange: (options: ProductOptionDraft[]) => void;
  onVariantsChange: (variants: ProductVariantDraft[]) => void;
};

const suggestedOptions = ["Color", "Size", "Configuration", "Fabric", "Leg Style"];

function variantKey(options: Record<string, string>) {
  return Object.entries(options)
    .map(([name, value]) => `${name}:${value}`)
    .sort()
    .join("|");
}

function buildCombinations(options: ProductOptionDraft[]): Array<Record<string, string>> {
  const usable = options
    .filter((option) => option.name.trim() && option.values.some((value) => value.value.trim()))
    .map((option) => ({
      name: option.name.trim(),
      values: option.values.map((value) => value.value.trim()).filter(Boolean)
    }));

  if (!usable.length) {
    return [];
  }

  return usable.reduce<Array<Record<string, string>>>(
    (combinations, option) =>
      combinations.flatMap((combination) => option.values.map((value) => ({ ...combination, [option.name]: value }))),
    [{}]
  );
}

export function VariantEditor({ options, variants, onOptionsChange, onVariantsChange }: VariantEditorProps) {
  const [groupBy, setGroupBy] = useState<string>("");
  const [pickerTarget, setPickerTarget] = useState<{ kind: "variant"; key: string } | { kind: "option"; optionIndex: number; valueIndex: number } | null>(null);

  const combinations = buildCombinations(options);
  const activeGroup = groupBy || options[0]?.name?.trim() || "";

  const updateOption = (index: number, patch: Partial<ProductOptionDraft>) => {
    onOptionsChange(options.map((option, current) => (current === index ? { ...option, ...patch } : option)));
  };

  const addOption = (name = "") => {
    onOptionsChange([...options, { name, values: [{ value: "", swatch: null, media_id: null, media_url: null }] }]);
  };

  const removeOption = (index: number) => {
    const removed = options[index];
    onOptionsChange(options.filter((_, current) => current !== index));
    onVariantsChange(
      variants.map((variant) => {
        const next = { ...variant.options };
        delete next[removed.name.trim()];

        return { ...variant, options: next };
      })
    );
  };

  const updateValue = (optionIndex: number, valueIndex: number, patch: Partial<ProductOptionDraft["values"][number]>) => {
    const option = options[optionIndex];
    updateOption(optionIndex, {
      values: option.values.map((value, current) => (current === valueIndex ? { ...value, ...patch } : value))
    });
  };

  const syncVariants = () => {
    const existing = new Map(variants.map((variant) => [variantKey(variant.options), variant]));

    onVariantsChange(
      combinations.map((combination, index) => {
        const previous = existing.get(variantKey(combination));

        return (
          previous ?? {
            options: combination,
            sku: "",
            price: "",
            stock: "0",
            media_id: null,
            media_url: null,
            is_default: index === 0,
            is_active: true
          }
        );
      })
    );
  };

  const updateVariant = (key: string, patch: Partial<ProductVariantDraft>) => {
    onVariantsChange(variants.map((variant) => (variantKey(variant.options) === key ? { ...variant, ...patch } : variant)));
  };

  const setDefault = (key: string) => {
    onVariantsChange(variants.map((variant) => ({ ...variant, is_default: variantKey(variant.options) === key })));
  };

  const grouped = activeGroup
    ? Array.from(
        variants.reduce((map, variant) => {
          const label = variant.options[activeGroup] ?? "Other";
          map.set(label, [...(map.get(label) ?? []), variant]);

          return map;
        }, new Map<string, ProductVariantDraft[]>())
      )
    : [["All variants", variants] as [string, ProductVariantDraft[]]];

  const staleMatrix = combinations.length !== variants.length;

  return (
    <AppCard className="p-5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-bold">Variants</h2>
        <AppButton type="button" size="sm" variant="outline" className="gap-2" onClick={() => addOption()}>
          <Plus className="size-4" /> Add option
        </AppButton>
      </div>

      <div className="mt-5 space-y-4">
        {options.map((option, optionIndex) => (
          <div key={optionIndex} className="rounded-lg border border-neutral-200 p-4 dark:border-white/10">
            <div className="flex items-start gap-3">
              <GripVertical className="mt-2.5 size-4 shrink-0 text-neutral-400" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={option.name}
                    onChange={(event) => updateOption(optionIndex, { name: event.target.value })}
                    placeholder="Option name"
                    list="variant-option-names"
                    className="h-10 w-full max-w-56 rounded-md border border-neutral-300 px-3 text-sm font-semibold outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950"
                  />
                  <button
                    type="button"
                    aria-label="Remove option"
                    onClick={() => removeOption(optionIndex)}
                    className="ms-auto grid size-9 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-white/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {option.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex flex-wrap items-center gap-2">
                      <input
                        value={value.value}
                        onChange={(event) => updateValue(optionIndex, valueIndex, { value: event.target.value })}
                        placeholder="Value"
                        className="h-9 w-full max-w-44 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950"
                      />
                      <input
                        value={value.swatch ?? ""}
                        onChange={(event) => updateValue(optionIndex, valueIndex, { swatch: event.target.value })}
                        placeholder="#hex"
                        className="h-9 w-24 rounded-md border border-neutral-300 px-2 text-xs outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950"
                      />
                      {value.swatch ? <span className="size-6 rounded-full border border-neutral-200" style={{ backgroundColor: value.swatch }} /> : null}
                      <button
                        type="button"
                        onClick={() => setPickerTarget({ kind: "option", optionIndex, valueIndex })}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-dashed border-neutral-300 px-2.5 text-xs transition hover:border-neutral-950 dark:border-white/15"
                      >
                        {value.media_url ? (
                          <Image src={value.media_url} alt={value.value} width={20} height={20} className="size-5 rounded object-cover" />
                        ) : (
                          <ImagePlus className="size-4" />
                        )}
                        {value.media_url ? "Change" : "Image"}
                      </button>
                      {option.values.length > 1 ? (
                        <button
                          type="button"
                          aria-label="Remove value"
                          onClick={() => updateOption(optionIndex, { values: option.values.filter((_, current) => current !== valueIndex) })}
                          className="grid size-8 place-items-center rounded-md text-neutral-400 transition hover:text-red-600"
                        >
                          <X className="size-4" />
                        </button>
                      ) : null}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateOption(optionIndex, { values: [...option.values, { value: "", swatch: null, media_id: null, media_url: null }] })}
                    className="text-xs font-bold text-neutral-700 underline dark:text-neutral-300"
                  >
                    Add another value
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <datalist id="variant-option-names">
          {suggestedOptions.map((name) => <option key={name} value={name} />)}
        </datalist>

        {options.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center dark:border-white/15">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">Add options like Color, Size, Configuration or Fabric to build variants.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {suggestedOptions.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => addOption(name)}
                  className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold transition hover:border-neutral-950 dark:border-white/15"
                >
                  + {name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {options.length ? (
        <div className="mt-6 border-t border-neutral-200 pt-5 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-500">Group by</span>
              <div className="relative">
                <select
                  value={activeGroup}
                  onChange={(event) => setGroupBy(event.target.value)}
                  className="h-9 appearance-none rounded-md border border-neutral-300 pe-8 ps-3 text-sm font-semibold outline-none dark:border-white/15 dark:bg-neutral-950"
                >
                  {options.filter((option) => option.name.trim()).map((option) => (
                    <option key={option.name} value={option.name.trim()}>{option.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-2 top-2.5 size-4 text-neutral-500" />
              </div>
            </div>
            <AppButton type="button" size="sm" variant={staleMatrix ? "primary" : "outline"} onClick={syncVariants}>
              {variants.length ? "Regenerate variants" : "Generate variants"} ({combinations.length})
            </AppButton>
          </div>

          {staleMatrix && variants.length ? (
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
              Options changed. Regenerate to rebuild the {combinations.length} combinations. Prices already entered are kept.
            </p>
          ) : null}

          <div className="mt-4 space-y-4">
            {grouped.map(([label, groupVariants]) => (
              <div key={label} className="overflow-hidden rounded-lg border border-neutral-200 dark:border-white/10">
                <div className="flex items-center justify-between gap-3 bg-neutral-50 px-4 py-2.5 dark:bg-white/5">
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs text-neutral-500">{groupVariants.length} variant{groupVariants.length === 1 ? "" : "s"}</p>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-white/10">
                  {groupVariants.map((variant) => {
                    const key = variantKey(variant.options);

                    return (
                      <div key={key} className="grid gap-3 p-3 sm:grid-cols-[auto_1fr_120px_100px_auto] sm:items-center">
                        <button
                          type="button"
                          onClick={() => setPickerTarget({ kind: "variant", key })}
                          className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-800"
                        >
                          {variant.media_url ? (
                            <Image src={variant.media_url} alt={Object.values(variant.options).join(" ")} width={48} height={48} className="size-12 object-cover" />
                          ) : (
                            <ImagePlus className="size-4 text-neutral-400" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{Object.values(variant.options).join(" / ") || "Default"}</p>
                          <input
                            value={variant.sku}
                            onChange={(event) => updateVariant(key, { sku: event.target.value })}
                            placeholder="SKU is generated when empty"
                            className="mt-1 h-8 w-full max-w-64 rounded border border-neutral-200 px-2 font-mono text-xs outline-none focus:border-neutral-950 dark:border-white/10 dark:bg-neutral-950"
                          />
                        </div>
                        <input
                          value={variant.price}
                          onChange={(event) => updateVariant(key, { price: event.target.value })}
                          inputMode="decimal"
                          placeholder="₪ 0.00"
                          className="h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950"
                        />
                        <input
                          value={variant.stock}
                          onChange={(event) => updateVariant(key, { stock: event.target.value })}
                          inputMode="numeric"
                          placeholder="0"
                          className="h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDefault(key)}
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs font-semibold transition",
                              variant.is_default
                                ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                                : "border-neutral-300 text-neutral-600 hover:border-neutral-950 dark:border-white/15 dark:text-neutral-300"
                            )}
                          >
                            Default
                          </button>
                          <button
                            type="button"
                            aria-label="Remove variant"
                            onClick={() => onVariantsChange(variants.filter((current) => variantKey(current.options) !== key))}
                            className="grid size-8 place-items-center rounded-md text-neutral-400 transition hover:text-red-600"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <MediaPicker
        open={Boolean(pickerTarget)}
        onOpenChange={(next) => (next ? null : setPickerTarget(null))}
        multiple={false}
        folder="products"
        title="Select variant image"
        onSelect={(items) => {
          const item = items[0];

          if (!item || !pickerTarget) {
            return;
          }

          if (pickerTarget.kind === "variant") {
            updateVariant(pickerTarget.key, { media_id: item.id, media_url: item.url });
          } else {
            updateValue(pickerTarget.optionIndex, pickerTarget.valueIndex, { media_id: item.id, media_url: item.url });
          }

          setPickerTarget(null);
        }}
      />
    </AppCard>
  );
}
