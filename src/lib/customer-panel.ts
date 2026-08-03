export const customer = {
  name: "David Garcia",
  firstName: "David",
  lastName: "Garcia",
  email: "david.garcia@gmail.com",
  phone: "+972 50-123-4567",
  avatar: "/images/showroom-consultation.png"
};

export const customerOrders = [
  { id: "SL12345", title: "Cloud Modular Sofa", date: "May 18, 2026", status: "In Production", price: 6990, image: "/images/sofa-cloud-modular.png", color: "Beige Linen" },
  { id: "SL12330", title: "Luca Dining Table", date: "May 10, 2026", status: "Confirmed", price: 6990, image: "/images/product-luca-dining-table.png", color: "Natural Oak" },
  { id: "SL12228", title: "Luna Upholstered Bed", date: "Apr 29, 2026", status: "Delivered", price: 6990, image: "/images/category-bedroom.png", color: "Cream Boucle" },
  { id: "SL12210", title: "Ribbed Coffee Table", date: "Apr 15, 2026", status: "Delivered", price: 6990, image: "/images/product-marble-coffee-table.png", color: "Natural Oak" },
  { id: "SL12200", title: "Haven Swivel Chair", date: "Apr 5, 2026", status: "Cancelled", price: 6990, image: "/images/product-nora-armchair.png", color: "Cream Boucle" }
];

export const savedDesigns = [
  { id: "DS-1001", title: "Cloud Modular Sofa", status: "In Progress", image: "/images/sofa-cloud-modular.png", configuration: "L-Shape", fabric: "Linen Weave Beige", size: "320 cm x 180 cm", extras: "Throw Pillows" },
  { id: "DS-1002", title: "Luna U-shape", status: "Requested", image: "/images/sofa-luna.png", configuration: "U-Shape", fabric: "Boucle Cream", size: "360 cm x 200 cm", extras: "No Extras" },
  { id: "DS-1003", title: "Ella Straight Sofa", status: "Consulted", image: "/images/sofa-ella.png", configuration: "Straight", fabric: "Linen Olive Green", size: "300 cm x 280 cm", extras: "Wooden Legs" },
  { id: "DS-1004", title: "Haven Chaise Sofa", status: "In Progress", image: "/images/category-sofas.png", configuration: "Chaise Right", fabric: "Weave Warm Taupe", size: "300 cm x 160 cm", extras: "No Extras" }
];

export const wishlistItems = [
  ...savedDesigns.map((item) => ({ id: item.id, title: item.title, price: 1290, image: item.image })),
  { id: "WL-5", title: "Cloud Modular Sofa", price: 1290, image: "/images/category-chairs.png" },
  { id: "WL-6", title: "Ribbed Coffee Table", price: 1290, image: "/images/product-ribbed-side-table.png" },
  { id: "WL-7", title: "Luca Dining Chair", price: 1290, image: "/images/product-dining-chair.png" },
  { id: "WL-8", title: "Linen Cushion", price: 1290, image: "/images/product-linen-cushion.png" }
];

export const conversations = [
  { id: "MSG-1", name: "Shany Living Team", message: "Your order #SL12345 is now in production.", time: "10:24 AM", unread: 2, avatar: "/images/showroom-interior.png" },
  { id: "MSG-2", name: "Design Consultant - Anna", message: "We've received your fabric selection.", time: "1d ago", unread: 0, avatar: "/images/showroom-consultation.png" },
  { id: "MSG-3", name: "Customer Support", message: "How can we help you today?", time: "Yesterday", unread: 0, avatar: "/images/category-chairs.png" }
];

export const addresses = [
  { id: "ADDR-1", label: "Home", line: "HaYarkon St. 123", city: "Tel Aviv-Yafo 6423906", country: "Israel", phone: "+972 50-123-4568", isDefault: true },
  { id: "ADDR-2", label: "Work", line: "Menachem Begin Rd 144", city: "Tel Aviv-Yafo 6492606", country: "Israel", phone: "+972 50-123-4568", isDefault: false },
  { id: "ADDR-3", label: "Home 2", line: "HaYarkon St. 123", city: "Tel Aviv-Yafo 6423906", country: "Israel", phone: "+972 50-123-4568", isDefault: false }
];

export const paymentMethods = [
  { id: "CARD-1", brand: "Mastercard", last4: "4242", label: "Primary card", expires: "08/29" },
  { id: "BANK-1", brand: "Bank", last4: "1188", label: "Bank transfer account", expires: "Verified" }
];

export const giftCards = [
  { id: "GIFT-1", name: "Housewarming Gift Card", balance: 500, status: "Ready soon" },
  { id: "GIFT-2", name: "Design Consultation Credit", balance: 250, status: "Ready soon" }
];
