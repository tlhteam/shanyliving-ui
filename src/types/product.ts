export type ProductOptionValueDraft = {
  id?: number;
  value: string;
  swatch: string | null;
  media_id: number | null;
  media_url: string | null;
};

export type ProductOptionDraft = {
  id?: number;
  name: string;
  values: ProductOptionValueDraft[];
};

export type ProductVariantDraft = {
  id?: number;
  options: Record<string, string>;
  sku: string;
  price: string;
  stock: string;
  media_id: number | null;
  media_url: string | null;
  is_default: boolean;
  is_active: boolean;
};

export type AdminProductImage = {
  id: number;
  media_id: number | null;
  path: string | null;
  folder: string | null;
  url: string | null;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
};

export type AdminProduct = {
  id: number;
  uuid: string | null;
  name: string;
  slug: string;
  sku: string | null;
  barcode: string | null;
  subcategory: string | null;
  description: string | null;
  price: number | null;
  compare_at_price: number | null;
  seat_range: string | null;
  colors: string[] | null;
  is_featured: boolean;
  is_best_seller: boolean;
  is_customizable: boolean;
  is_active: boolean;
  sort_order: number | null;
  image: string | null;
  image_url: string | null;
  category: { id: number; name: string; slug: string } | null;
  images: AdminProductImage[];
  options: Array<{
    id: number;
    name: string;
    position: number;
    values: Array<{ id: number; value: string; swatch: string | null; media_id: number | null; media_url: string | null; position: number }>;
  }>;
  variants: Array<{
    id: number;
    sku: string | null;
    title: string | null;
    price: number | null;
    stock: number;
    media_id: number | null;
    media_url: string | null;
    options: Record<string, string>;
    is_default: boolean;
    is_active: boolean;
  }>;
  tags: Array<{ id: number; name: string; slug: string }>;
};
