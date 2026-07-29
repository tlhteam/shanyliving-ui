export type UserRole = "customer" | "admin";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  startingPrice: number;
  featured: boolean;
  active: boolean;
};

export type LeadStatus =
  | "new"
  | "whatsapp_started"
  | "contacted"
  | "quote_sent"
  | "showroom_booked"
  | "won"
  | "lost";
