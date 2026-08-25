export const customOrderCategories = ["sofas", "living-room", "dining", "bedroom"] as const;

// "new-arrivals" isn't a real product category (no product carries it) — it's the New Arrivals
// collection page slug. Every item shown there is drawn from the categories above, so it's
// included here too, purely so ProductGridPage hides price-sorting on that page as well.
export const customOrderSlugs = [...customOrderCategories, "new-arrivals"] as const;

export function isCustomOrderCategory(category?: string | null) {
  return (customOrderSlugs as readonly string[]).includes(category ?? "");
}
