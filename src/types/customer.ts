export type CustomerAddress = {
  id: number;
  label: string | null;
  recipient: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postcode: string | null;
  country: string | null;
  phone: string | null;
  is_default: boolean;
};

export type CustomerWishlistItem = {
  id: number;
  product_id: number | null;
  title: string;
  price: number | null;
  image: string | null;
  note: string | null;
};

export type CustomerSavedDesign = {
  id: number;
  product_id: number | null;
  reference: string;
  title: string;
  status: string;
  configuration: string | null;
  fabric: string | null;
  size: string | null;
  extras: string | null;
  image: string | null;
  price: number | null;
  notes: string | null;
};

export type CustomerPaymentMethod = {
  id: number;
  type: string;
  brand: string | null;
  holder: string | null;
  last4: string | null;
  expires: string | null;
  is_default: boolean;
};

export type CustomerGiftCard = {
  id: number;
  code: string;
  name: string;
  initial_balance: number | string;
  balance: number | string;
  currency: string;
  status: string;
  expires_at: string | null;
};

export type CustomerSettings = {
  appearance: "light" | "dark" | "system";
  language: string;
  notifications: { email?: boolean; sms?: boolean; marketing?: boolean; whatsapp?: boolean } | null;
  two_factor_enabled: boolean;
  tour_completed: boolean;
};

export type CustomerProfile = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
};
