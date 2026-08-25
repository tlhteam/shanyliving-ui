export const customOrderCategories = ["sofas", "living-room", "dining", "bedroom"] as const;

export function isCustomOrderCategory(category?: string | null) {
  return (customOrderCategories as readonly string[]).includes(category ?? "");
}
