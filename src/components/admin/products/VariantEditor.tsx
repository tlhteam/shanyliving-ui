"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ImagePlus, Plus, Sparkles, Trash2, X } from "lucide-react";
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

const suggestedOptions = ["Size", "Configuration", "Fabric", "Color", "Leg Style"];

export function variantKey(options: Record<string, string>) {
  return Object.entries(options)
    .map(([name, value]) => `${name}:${value}`)
    .sort()
    .join("|");
}

export function buildCombinations(options: ProductOptionDraft[]): Array<Record<string, string>> {
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

const inputClass = "h-9 w-full rounded-md border border-neutral-300 px-2.5 text-sm outline-none transition focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white";

export function VariantEditor({ options, variants, onOptionsChange, onVariantsChange }: VariantEditorProps) {
  const t = useTranslations("adminPanel.variantEditor");
  const [groupBy, setGroupBy] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(true);
  const [pickerTarget, setPickerTarget] = useState<
    { kind: "variant"; key: string } | { kind: "option"; optionIndex: number; valueIndex: number } | null
  >(null);

  const combinations = useMemo(() => buildCombinations(options), [options]);
  const optionNames = useMemo(
    () => options.map((option) => option.name.trim()).filter(Boolean),
    [options]
  );
  const activeGroup = groupBy && optionNames.includes(groupBy) ? groupBy : optionNames[0] ?? "";
  const staleMatrix = combinations.length !== variants.length;

  const updateOption = (index: number, patch: Partial<ProductOptionDraft>) => {
    onOptionsChange(options.map((option, current) => (current === index ? { ...option, ...patch } : option)));
  };

  const addOption = (name = "") => {
    onOptionsChange([...options, { name, values: [{ value: "", swatch: null, media_id: null, media_url: null }] }]);
    setOptionsOpen(true);
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
    setSelected([]);
  };

  const updateVariant = (key: string, patch: Partial<ProductVariantDraft>) => {
    onVariantsChange(variants.map((variant) => (variantKey(variant.options) === key ? { ...variant, ...patch } : variant)));
  };

  const setDefault = (key: string) => {
    onVariantsChange(variants.map((variant) => ({ ...variant, is_default: variantKey(variant.options) === key })));
  };

  const removeVariants = (keys: string[]) => {
    onVariantsChange(variants.filter((variant) => !keys.includes(variantKey(variant.options))));
    setSelected((current) => current.filter((key) => !keys.includes(key)));
  };

  const applyBulk = () => {
    onVariantsChange(
      variants.map((variant) => {
        if (!selected.includes(variantKey(variant.options))) {
          return variant;
        }

        return {
          ...variant,
          price: bulkPrice === "" ? variant.price : bulkPrice,
          stock: bulkStock === "" ? variant.stock : bulkStock
        };
      })
    );
    setBulkPrice("");
    setBulkStock("");
  };

  const toggleSelected = (key: string) => {
    setSelected((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  const allKeys = variants.map((variant) => variantKey(variant.options));
  const allSelected = allKeys.length > 0 && selected.length === allKeys.length;

  const grouped = activeGroup
    ? [
        ...variants
          .reduce((map, variant) => {
            const label = variant.options[activeGroup] ?? t("other");
            map.set(label, [...(map.get(label) ?? []), variant]);

            return map;
          }, new Map<string, ProductVariantDraft[]>())
          .entries()
      ]
    : [[t("allVariants"), variants] as [string, ProductVariantDraft[]]];

  return (
    <AppCard className="p-4 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-bold sm:text-xl">{t("title")}</h2>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {t("summary", { variants: variants.length, options: optionNames.length })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AppButton type="button" size="sm" variant="outline" className="gap-2" onClick={() => setOptionsOpen((current) => !current)}>
            <ChevronDown className={cn("size-4 transition", optionsOpen && "rotate-180")} />
            {t("options")}
          </AppButton>
          <AppButton type="button" size="sm" variant="outline" className="gap-2" onClick={() => addOption()}>
            <Plus className="size-4" /> {t("addOption")}
          </AppButton>
        </div>
      </div>

      {optionsOpen ? (
        <div className="mt-4 space-y-3">
          {options.map((option, optionIndex) => (
            <div key={optionIndex} className="rounded-lg border border-neutral-200 p-3 dark:border-white/10 sm:p-4">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={option.name}
                  onChange={(event) => updateOption(optionIndex, { name: event.target.value })}
                  placeholder={t("optionName")}
                  list="variant-option-names"
                  className={cn(inputClass, "h-10 max-w-56 font-semibold")}
                />
                <button
                  type="button"
                  aria-label={t("removeOption")}
                  onClick={() => removeOption(optionIndex)}
                  className="ms-auto grid size-9 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-white/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {option.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="grid grid-cols-[1fr_auto] items-center gap-2 sm:grid-cols-[minmax(0,11rem)_6rem_auto_auto_auto]">
                    <input
                      value={value.value}
                      onChange={(event) => updateValue(optionIndex, valueIndex, { value: event.target.value })}
                      placeholder={t("value")}
                      className={inputClass}
                    />
                    <input
                      value={value.swatch ?? ""}
                      onChange={(event) => updateValue(optionIndex, valueIndex, { swatch: event.target.value })}
                      placeholder="#hex"
                      className={cn(inputClass, "font-mono text-xs")}
                    />
                    <span
                      className={cn("hidden size-7 rounded-full border border-neutral-200 sm:block dark:border-white/15", !value.swatch && "opacity-0")}
                      style={value.swatch ? { backgroundColor: value.swatch } : undefined}
                    />
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
                      {value.media_url ? t("change") : t("image")}
                    </button>
                    {option.values.length > 1 ? (
                      <button
                        type="button"
                        aria-label={t("removeValue")}
                        onClick={() => updateOption(optionIndex, { values: option.values.filter((_, current) => current !== valueIndex) })}
                        className="grid size-9 place-items-center rounded-md text-neutral-400 transition hover:text-red-600"
                      >
                        <X className="size-4" />
                      </button>
                    ) : (
                      <span className="hidden sm:block" />
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateOption(optionIndex, { values: [...option.values, { value: "", swatch: null, media_id: null, media_url: null }] })}
                  className="text-xs font-bold text-neutral-700 underline dark:text-neutral-300"
                >
                  {t("addValue")}
                </button>
              </div>
            </div>
          ))}

          <datalist id="variant-option-names">
            {suggestedOptions.map((name) => <option key={name} value={name} />)}
          </datalist>

          {options.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 p-5 text-center dark:border-white/15">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{t("emptyHint")}</p>
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
      ) : null}

      {options.length ? (
        <div className="mt-5 border-t border-neutral-200 pt-4 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">{t("groupBy")}</span>
              <div className="relative">
                <select
                  value={activeGroup}
                  onChange={(event) => setGroupBy(event.target.value)}
                  className="h-9 appearance-none rounded-md border border-neutral-300 pe-8 ps-3 text-sm font-semibold outline-none dark:border-white/15 dark:bg-neutral-950"
                >
                  {optionNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-2 top-2.5 size-4 text-neutral-500" />
              </div>
            </div>
            <AppButton type="button" size="sm" variant={staleMatrix ? "primary" : "outline"} className="gap-2" onClick={syncVariants}>
              <Sparkles className="size-4" />
              {variants.length ? t("regenerate") : t("generate")} ({combinations.length})
            </AppButton>
          </div>

          {staleMatrix && variants.length ? (
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
              {t("stale", { count: combinations.length })}
            </p>
          ) : null}

          {selected.length ? (
            <div className="mt-4 flex flex-wrap items-end gap-2 rounded-lg border border-neutral-300 bg-neutral-50 p-3 dark:border-white/15 dark:bg-white/5">
              <p className="me-auto text-sm font-bold">{t("selected", { count: selected.length })}</p>
              <label className="text-xs font-semibold">
                <span className="mb-1 block text-neutral-500 dark:text-neutral-400">{t("price")}</span>
                <input value={bulkPrice} onChange={(event) => setBulkPrice(event.target.value)} inputMode="decimal" placeholder="0.00" className={cn(inputClass, "w-24")} />
              </label>
              <label className="text-xs font-semibold">
                <span className="mb-1 block text-neutral-500 dark:text-neutral-400">{t("available")}</span>
                <input value={bulkStock} onChange={(event) => setBulkStock(event.target.value)} inputMode="numeric" placeholder="0" className={cn(inputClass, "w-20")} />
              </label>
              <AppButton type="button" size="sm" onClick={applyBulk} disabled={bulkPrice === "" && bulkStock === ""}>{t("apply")}</AppButton>
              <AppButton type="button" size="sm" variant="outline" onClick={() => removeVariants(selected)}>{t("delete")}</AppButton>
              <AppButton type="button" size="sm" variant="ghost" onClick={() => setSelected([])}>{t("clear")}</AppButton>
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 dark:border-white/10">
            <table className="w-full min-w-200 border-collapse text-sm">
              <thead className="bg-neutral-50 text-start text-xs uppercase tracking-[0.08em] text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
                <tr>
                  <th scope="col" className="w-10 px-3 py-2.5">
                    <input
                      type="checkbox"
                      aria-label={t("selectAll")}
                      checked={allSelected}
                      onChange={() => setSelected(allSelected ? [] : allKeys)}
                      className="size-4 accent-neutral-900"
                    />
                  </th>
                  <th scope="col" className="w-14 px-2 py-2.5 text-start font-bold">{t("image")}</th>
                  <th scope="col" className="px-3 py-2.5 text-start font-bold">{t("variant")}</th>
                  <th scope="col" className="w-56 px-3 py-2.5 text-start font-bold">{t("sku")}</th>
                  <th scope="col" className="w-28 px-3 py-2.5 text-start font-bold">{t("price")}</th>
                  <th scope="col" className="w-24 px-3 py-2.5 text-start font-bold">{t("available")}</th>
                  <th scope="col" className="w-28 px-3 py-2.5 text-start font-bold">{t("status")}</th>
                  <th scope="col" className="w-28 px-3 py-2.5 text-start font-bold">{t("default")}</th>
                  <th scope="col" className="w-12 px-2 py-2.5" />
                </tr>
              </thead>
              {grouped.map(([label, groupVariants]) => (
                <tbody key={label} className="divide-y divide-neutral-200 dark:divide-white/10">
                  {activeGroup ? (
                    <tr className="bg-neutral-50/70 dark:bg-white/5">
                      <td colSpan={9} className="px-3 py-2">
                        <span className="text-xs font-bold uppercase tracking-[0.1em]">{label}</span>
                        <span className="ms-2 text-xs text-neutral-500 dark:text-neutral-400">
                          {t("groupCount", { count: groupVariants.length })}
                        </span>
                      </td>
                    </tr>
                  ) : null}
                  {groupVariants.map((variant) => {
                    const key = variantKey(variant.options);

                    return (
                      <tr key={key} className={cn("align-middle", selected.includes(key) && "bg-neutral-50 dark:bg-white/5")}>
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            aria-label={t("selectRow", { name: Object.values(variant.options).join(" ") })}
                            checked={selected.includes(key)}
                            onChange={() => toggleSelected(key)}
                            className="size-4 accent-neutral-900"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            aria-label={t("selectImage")}
                            onClick={() => setPickerTarget({ kind: "variant", key })}
                            className="grid size-10 place-items-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-800"
                          >
                            {variant.media_url ? (
                              <Image src={variant.media_url} alt={Object.values(variant.options).join(" ")} width={40} height={40} className="size-10 object-cover" />
                            ) : (
                              <ImagePlus className="size-4 text-neutral-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <span className="block font-semibold">{Object.values(variant.options).join(" / ") || t("default")}</span>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={variant.sku}
                            onChange={(event) => updateVariant(key, { sku: event.target.value })}
                            placeholder={t("skuPlaceholder")}
                            className={cn(inputClass, "font-mono text-xs")}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={variant.price}
                            onChange={(event) => updateVariant(key, { price: event.target.value })}
                            inputMode="decimal"
                            placeholder="0.00"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={variant.stock}
                            onChange={(event) => updateVariant(key, { stock: event.target.value })}
                            inputMode="numeric"
                            placeholder="0"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => updateVariant(key, { is_active: !variant.is_active })}
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs font-semibold transition",
                              variant.is_active
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200"
                                : "border-neutral-300 text-neutral-500 dark:border-white/15 dark:text-neutral-400"
                            )}
                          >
                            {variant.is_active ? t("active") : t("hidden")}
                          </button>
                        </td>
                        <td className="px-3 py-2">
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
                            {variant.is_default ? t("default") : t("setDefault")}
                          </button>
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            aria-label={t("removeVariant")}
                            onClick={() => removeVariants([key])}
                            className="grid size-8 place-items-center rounded-md text-neutral-400 transition hover:text-red-600"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ))}
            </table>
          </div>

          {variants.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{t("noVariants")}</p>
          ) : null}
        </div>
      ) : null}

      <MediaPicker
        open={Boolean(pickerTarget)}
        onOpenChange={(next) => (next ? null : setPickerTarget(null))}
        multiple={false}
        folder="products"
        title={t("selectImage")}
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
