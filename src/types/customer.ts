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

export type CustomerOrderItem = {
  id?: number;
  product_name?: string | null;
  name?: string | null;
  title?: string | null;
  image?: string | null;
  quantity?: number | null;
  total?: number | string | null;
  unit_price?: number | string | null;
};

export type CustomerOrder = {
  id: number;
  reference: string;
  currency: string;
  grand_total: number | string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  placed_at: string | null;
  items?: CustomerOrderItem[];
};

export type CustomerMessage = {
  id: string | number;
  name?: string;
  title?: string;
  message?: string;
  time?: string;
  unread?: number | boolean;
  avatar?: string | null;
};

export type CustomerDashboard = {
  summary: {
    active_orders: number;
    saved_designs: number;
    wishlist: number;
    messages: number;
  };
  active_order: CustomerOrder | null;
  saved_designs: CustomerSavedDesign[];
  recent_messages: CustomerMessage[];
};
