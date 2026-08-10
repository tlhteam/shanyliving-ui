import { BarChart3, Boxes, CalendarClock, ContactRound, FileImage, Gift, Layers3, Mail, Palette, Settings, Sofa, SwatchBook, UserCog, Users, Wand2 } from "lucide-react";

export type AdminRow = Record<string, string | number>;

export const adminSections = [
  { href: "/admin", label: "Dashboard", group: "Overview", icon: BarChart3 },
  { href: "/admin/products", label: "Products", group: "Catalog", icon: Sofa },
  { href: "/admin/categories", label: "Categories", group: "Catalog", icon: Boxes },
  { href: "/admin/fabrics", label: "Fabrics", group: "Catalog", icon: SwatchBook },
  { href: "/admin/colors", label: "Colors", group: "Catalog", icon: Palette },
  { href: "/admin/configurations", label: "Configurations", group: "Sales Flow", icon: Wand2 },
  { href: "/admin/leads", label: "Leads", group: "Sales Flow", icon: ContactRound },
  { href: "/admin/customers", label: "Customers", group: "People", icon: Users },
  { href: "/admin/messages", label: "Messages", group: "People", icon: Mail },
  { href: "/admin/users", label: "Accounts", group: "People", icon: UserCog },
  { href: "/admin/gift-cards", label: "Gift Cards", group: "People", icon: Gift },
  { href: "/admin/appointments", label: "Appointments", group: "People", icon: CalendarClock },
  { href: "/admin/media", label: "Media", group: "Content", icon: FileImage },
  { href: "/admin/analytics", label: "Analytics", group: "Content", icon: Layers3 },
  { href: "/admin/settings", label: "Settings", group: "System", icon: Settings }
];

export const products: AdminRow[] = [
  { id: "SL-P001", name: "Cloud Modular", category: "Sofas", price: "₪ 6,990", status: "Active", production: "Made to Order", sizes: "3-4 Seater", fabrics: "Linen, Boucle, Easy-clean", customizable: "Yes" },
  { id: "SL-P002", name: "Luna Sofa", category: "Sofas", price: "₪ 5,890", status: "Active", production: "Made to Order", sizes: "2-3 Seater", fabrics: "Velvet, Linen", customizable: "Yes" },
  { id: "SL-P003", name: "Noa Sofa", category: "Sofas", price: "₪ 6,280", status: "Active", production: "Made to Order", sizes: "3-5 Seater", fabrics: "Pet-friendly, Easy-clean", customizable: "Yes" },
  { id: "SL-P004", name: "Ella Sofa", category: "Sofas", price: "₪ 7,650", status: "Draft", production: "Made to Order", sizes: "3-5 Seater", fabrics: "Linen, Boucle", customizable: "Yes" },
  { id: "SL-P005", name: "Marble Coffee Table", category: "Coffee Tables", price: "₪ 1,690", status: "Active", production: "Available Now", sizes: "Fixed", fabrics: "Not applicable", customizable: "No" }
];

export const categories: AdminRow[] = [
  { id: "CAT-01", name: "Sofas", slug: "sofas", products: 4, visibility: "Visible" },
  { id: "CAT-02", name: "Living Room", slug: "living-room", products: 3, visibility: "Visible" },
  { id: "CAT-03", name: "Dining Room", slug: "dining-room", products: 2, visibility: "Visible" },
  { id: "CAT-04", name: "Bedroom", slug: "bedroom", products: 1, visibility: "Hidden until launch" }
];

export const fabrics: AdminRow[] = [
  { id: "FAB-01", name: "Performance Linen", family: "Linen look", priceTier: "Premium", status: "Active" },
  { id: "FAB-02", name: "Soft Boucle", family: "Boucle", priceTier: "Premium", status: "Active" },
  { id: "FAB-03", name: "Pet Friendly Weave", family: "Pet-friendly", priceTier: "Standard", status: "Active" },
  { id: "FAB-04", name: "Velvet Touch", family: "Velvet", priceTier: "Premium", status: "Draft" }
];

export const colors: AdminRow[] = [
  { id: "COL-01", name: "Ivory", family: "Cream and white", hex: "#eee9df", status: "Active" },
  { id: "COL-02", name: "Warm Beige", family: "Beige and natural", hex: "#c9bca8", status: "Active" },
  { id: "COL-03", name: "Forest", family: "Green", hex: "#0f5f3f", status: "Active" },
  { id: "COL-04", name: "Walnut", family: "Brown", hex: "#705d49", status: "Active" }
];

export const configurations: AdminRow[] = [
  { reference: "SL-10482", customer: "Maya Cohen", product: "Cloud Modular", structure: "Right Chaise", size: "280 cm", fabric: "Easy-clean", color: "Warm Beige", status: "WhatsApp started" },
  { reference: "SL-10483", customer: "Daniel Levi", product: "Noa Sofa", structure: "Straight", size: "250 cm", fabric: "Boucle", color: "Ivory", status: "Quote sent" },
  { reference: "SL-10484", customer: "No customer yet", product: "Luna Sofa", structure: "Left Chaise", size: "Custom", fabric: "Linen look", color: "Taupe", status: "New" }
];

export const leads: AdminRow[] = [
  { reference: "SL-20001", name: "Maya Cohen", product: "Cloud Modular", source: "Instagram", status: "WhatsApp started", value: "₪ 6,990" },
  { reference: "SL-20002", name: "Daniel Levi", product: "Noa Sofa", source: "Google Ads", status: "Quote sent", value: "₪ 6,280" },
  { reference: "SL-20003", name: "Tamar Azulay", product: "Showroom Visit", source: "Direct", status: "Showroom visit booked", value: "Pending" }
];

export const customers: AdminRow[] = [
  { id: "CUS-01", name: "Maya Cohen", phone: "+972-50-000-0000", saved: 2, lastActivity: "Today" },
  { id: "CUS-02", name: "Daniel Levi", phone: "+972-52-000-0000", saved: 1, lastActivity: "Yesterday" },
  { id: "CUS-03", name: "Tamar Azulay", phone: "+972-54-000-0000", saved: 0, lastActivity: "This week" }
];

export const appointments: AdminRow[] = [
  { id: "APT-01", customer: "Tamar Azulay", date: "Jul 31, 2026", time: "11:00", purpose: "Showroom sofa consultation", status: "Booked" },
  { id: "APT-02", customer: "Maya Cohen", date: "Aug 1, 2026", time: "14:30", purpose: "Fabric review", status: "Pending" }
];

export const mediaItems: AdminRow[] = [
  { id: "MED-01", name: "Homepage Hero Placeholder", type: "Hero", usage: "Homepage", status: "Needs photo" },
  { id: "MED-02", name: "Showroom Placeholder", type: "Showroom", usage: "Showroom section", status: "Needs photo" },
  { id: "MED-03", name: "Product Card Placeholders", type: "Product", usage: "Catalog", status: "Needs photos" }
];

export const analyticsEvents: AdminRow[] = [
  { event: "ViewProduct", count: 248, trend: "+18%", priority: "High" },
  { event: "StartConfigurator", count: 96, trend: "+12%", priority: "High" },
  { event: "CompleteConfigurator", count: 41, trend: "+7%", priority: "High" },
  { event: "ClickWhatsApp", count: 37, trend: "+10%", priority: "Critical" }
];

export const settingsRows: AdminRow[] = [
  { setting: "WhatsApp number", value: "Add live business number", status: "Required" },
  { setting: "Default language", value: "Hebrew RTL for launch", status: "Planned" },
  { setting: "Tracking pixels", value: "GA4, Meta, TikTok", status: "Planned" },
  { setting: "Legal pages", value: "Privacy, accessibility, terms", status: "Needs review" }
];

export const adminNotifications = [
  { id: "ADM-1", title: "New lead from WhatsApp", message: "Maya asked about the Cloud Modular in boucle.", time: "9:12 AM", unread: true, href: "/admin/leads" },
  { id: "ADM-2", title: "Showroom appointment", message: "Consultation booked for Thursday 16:00.", time: "Yesterday", unread: true, href: "/admin/appointments" },
  { id: "ADM-3", title: "Configuration submitted", message: "Ella Sofa configuration ready for pricing.", time: "2d ago", unread: false, href: "/admin/configurations" }
];
