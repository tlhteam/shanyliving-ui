export type StorefrontProduct = {
  name: string;
  slug: string;
  category: "sofas" | "living-room" | "dining" | "bedroom" | "new-arrivals";
  subcategory: string;
  price: number;
  image: string;
  badge?: string;
  description?: string;
  seatRange?: string;
  colors?: string[];
};

export type StorefrontPage = {
  title: string;
  eyebrow: string;
  description: string;
  heroImage: string;
  filters: string[];
  products: StorefrontProduct[];
};

const colors = ["#eee9df", "#6a5845", "#0d5f43", "#d9d4ca"];

export const storefrontProducts: StorefrontProduct[] = [
  { name: "Cloud Modular Sofa", slug: "cloud-modular-sofa", category: "sofas", subcategory: "Modular Sofas", price: 6990, image: "/images/sofa-cloud-modular.png", badge: "Customizable", description: "Deep, soft cushions with flexible modules for everyday living.", seatRange: "3-4 Seater", colors },
  { name: "Luna Sofa", slug: "luna-sofa", category: "sofas", subcategory: "Straight Sofas", price: 5890, image: "/images/sofa-luna.png", badge: "Customizable", description: "Warm profile, generous seating and tailored comfort.", seatRange: "2-3 Seater", colors },
  { name: "Noa Sofa", slug: "noa-sofa", category: "sofas", subcategory: "Family Sofas", price: 6280, image: "/images/sofa-noa.png", badge: "Customizable", description: "A relaxed sofa with clean lines and soft layered cushions.", seatRange: "3-5 Seater", colors },
  { name: "Ella Sofa", slug: "ella-sofa", category: "sofas", subcategory: "L Shape Sofas", price: 7650, image: "/images/sofa-ella.png", badge: "Customizable", description: "Elegant lounge shape made for open living rooms.", seatRange: "3-5 Seater", colors },
  { name: "Milo Sofa", slug: "milo-sofa", category: "sofas", subcategory: "Straight Sofas", price: 5290, image: "/images/look-modern-elegance.png", badge: "Customizable", seatRange: "3-4 Seater", colors },
  { name: "Ava Modular Sofa", slug: "ava-modular-sofa", category: "sofas", subcategory: "Modular Sofas", price: 7890, image: "/images/category-living-room.png", badge: "Customizable", seatRange: "2-3 Seater", colors },
  { name: "Rio Sofa", slug: "rio-sofa", category: "sofas", subcategory: "Family Sofas", price: 5990, image: "/images/look-urban-luxury.png", badge: "Customizable", seatRange: "3-5 Seater", colors },
  { name: "Mia Sofa", slug: "mia-sofa", category: "sofas", subcategory: "Straight Sofas", price: 4220, image: "/images/category-sofas.png", badge: "Customizable", seatRange: "2-3 Seater", colors },
  { name: "Luna Lounge Chair", slug: "luna-lounge-chair", category: "living-room", subcategory: "Armchairs", price: 1690, image: "/images/product-nora-armchair.png", colors },
  { name: "Calista Marble Coffee Table", slug: "calista-marble-coffee-table", category: "living-room", subcategory: "Coffee Tables", price: 2490, image: "/images/product-marble-coffee-table.png", colors },
  { name: "Nova Sofa Side Table", slug: "nova-sofa-side-table", category: "living-room", subcategory: "Side Tables", price: 690, image: "/images/product-ribbed-side-table.png", colors },
  { name: "Milan TV Console", slug: "milan-tv-console", category: "living-room", subcategory: "TV Units", price: 3290, image: "/images/category-living-room.png", colors },
  { name: "Linea Slim Console Table", slug: "linea-slim-console-table", category: "living-room", subcategory: "Consoles", price: 1890, image: "/images/look-warm-minimalism.png", colors },
  { name: "Verona Sideboard", slug: "verona-sideboard", category: "living-room", subcategory: "Storage", price: 4490, image: "/images/category-coffee-tables.png", colors },
  { name: "Cloud Round Rug", slug: "cloud-round-rug", category: "living-room", subcategory: "Rugs", price: 1290, image: "/images/look-modern-elegance.png", colors },
  { name: "Aura Floor Lamp", slug: "aura-floor-lamp", category: "living-room", subcategory: "Lighting", price: 990, image: "/images/category-chairs.png", colors },
  { name: "Verona Dining Table", slug: "verona-dining-table", category: "dining", subcategory: "Tables", price: 1690, image: "/images/category-dining-room.png", colors },
  { name: "Nova Upholstered Chair", slug: "nova-upholstered-chair", category: "dining", subcategory: "Chairs", price: 2490, image: "/images/product-dining-chair.png", colors },
  { name: "Haven Bench", slug: "haven-bench", category: "dining", subcategory: "Benches", price: 690, image: "/images/look-urban-luxury.png", colors },
  { name: "Milano Sideboard", slug: "milano-sideboard", category: "dining", subcategory: "Sideboards", price: 3290, image: "/images/category-coffee-tables.png", colors },
  { name: "Nordic Glass Cabinet", slug: "nordic-glass-cabinet", category: "dining", subcategory: "Display Cabinets", price: 1890, image: "/images/showroom-interior.png", colors },
  { name: "Oslo Bar Stool", slug: "oslo-bar-stool", category: "dining", subcategory: "Bar Stools", price: 4490, image: "/images/look-urban-luxury.png", colors },
  { name: "Milano Extendable Table", slug: "milano-extendable-table", category: "dining", subcategory: "Extendable Tables", price: 1290, image: "/images/product-luca-dining-table.png", colors },
  { name: "Atlas Ceramic Table", slug: "atlas-ceramic-table", category: "dining", subcategory: "Tables", price: 1490, image: "/images/category-dining-room.png", colors },
  { name: "Luna Upholstered Bed", slug: "luna-upholstered-bed", category: "bedroom", subcategory: "Beds", price: 1690, image: "/images/category-bedroom.png", colors },
  { name: "Nova Floating Nightstand", slug: "nova-floating-nightstand", category: "bedroom", subcategory: "Nightstands", price: 2490, image: "/images/look-warm-minimalism.png", colors },
  { name: "Verona Dresser", slug: "verona-dresser", category: "bedroom", subcategory: "Dressers", price: 690, image: "/images/category-coffee-tables.png", colors },
  { name: "Oslo Wardrobe", slug: "oslo-wardrobe", category: "bedroom", subcategory: "Wardrobes", price: 3290, image: "/images/showroom-interior.png", colors },
  { name: "Siena Vanity Table", slug: "siena-vanity-table", category: "bedroom", subcategory: "Vanity Tables", price: 1890, image: "/images/category-living-room.png", colors },
  { name: "Milan Chest of Drawers", slug: "milan-chest-of-drawers", category: "bedroom", subcategory: "Chest of Drawers", price: 4490, image: "/images/category-bedroom.png", colors },
  { name: "Haven Bedroom Bench", slug: "haven-bedroom-bench", category: "bedroom", subcategory: "Benches", price: 1290, image: "/images/product-nora-armchair.png", colors },
  { name: "Dream Comfort Mattress", slug: "dream-comfort-mattress", category: "bedroom", subcategory: "Mattresses", price: 990, image: "/images/sofa-noa.png", colors },
  { name: "Siena Modular Sofa", slug: "siena-modular-sofa", category: "new-arrivals", subcategory: "Sofa Type", price: 1690, image: "/images/sofa-cloud-modular.png", badge: "New", colors },
  { name: "Luna Marble Coffee Table", slug: "luna-marble-coffee-table", category: "new-arrivals", subcategory: "Price", price: 2490, image: "/images/product-marble-coffee-table.png", badge: "New", colors },
  { name: "Verona Dining Table", slug: "new-verona-dining-table", category: "new-arrivals", subcategory: "Seats", price: 690, image: "/images/product-luca-dining-table.png", badge: "New", colors },
  { name: "Nova Upholstered Bed", slug: "nova-upholstered-bed", category: "new-arrivals", subcategory: "Size", price: 3290, image: "/images/category-bedroom.png", badge: "New", colors },
  { name: "Oslo Sideboard", slug: "oslo-sideboard", category: "new-arrivals", subcategory: "Price", price: 1890, image: "/images/category-coffee-tables.png", badge: "New", colors },
  { name: "Haven Lounge Chair", slug: "haven-lounge-chair", category: "new-arrivals", subcategory: "Sofa Type", price: 4490, image: "/images/category-chairs.png", badge: "New", colors },
  { name: "Cloud Ottoman", slug: "cloud-ottoman", category: "new-arrivals", subcategory: "Seats", price: 149, image: "/images/look-urban-luxury.png", badge: "New", colors }
];

export const storefrontPages: Record<string, StorefrontPage> = {
  sofas: {
    title: "Sofas",
    eyebrow: "Custom collection",
    description: "Choose a made-to-order sofa, then personalize size, structure, fabric, color and leg style.",
    heroImage: "/images/hero-living-room.png",
    filters: ["Sort by", "Sofa Type", "Size", "Seats", "Price"],
    products: storefrontProducts.filter((product) => product.category === "sofas")
  },
  "living-room": {
    title: "Living Room",
    eyebrow: "Complete the room",
    description: "Coffee tables, side tables, consoles, rugs and lounge pieces for a calm modern living space.",
    heroImage: "/images/category-living-room.png",
    filters: ["Coffee Tables", "Side Tables", "TV Units", "Consoles", "Armchairs", "Rugs", "Storage", "Lighting", "Decorative Accessories"],
    products: storefrontProducts.filter((product) => product.category === "living-room")
  },
  dining: {
    title: "Dining",
    eyebrow: "Gathering spaces",
    description: "Tables, chairs, benches and storage pieces designed for everyday meals and hosting.",
    heroImage: "/images/category-dining-room.png",
    filters: ["Tables", "Chairs", "Extendable Tables", "Benches", "Sideboards", "Display Cabinets", "Bar Stools", "Lighting", "Decorative Accessories"],
    products: storefrontProducts.filter((product) => product.category === "dining")
  },
  bedroom: {
    title: "Bedroom",
    eyebrow: "Quiet comfort",
    description: "Beds, nightstands, dressers and accessories that make the bedroom feel finished.",
    heroImage: "/images/category-bedroom.png",
    filters: ["Beds", "Nightstands", "Dressers", "Wardrobes", "Benches", "Mattresses", "Lighting", "Vanity Tables", "Chest of Drawers", "Decorative Accessories"],
    products: storefrontProducts.filter((product) => product.category === "bedroom")
  },
  "new-arrivals": {
    title: "New Arrivals",
    eyebrow: "Fresh pieces",
    description: "Latest showroom arrivals across sofas, bedroom, dining and living room collections.",
    heroImage: "/images/look-urban-luxury.png",
    filters: ["Sort by", "Sofa Type", "Size", "Seats", "Price", "Clear Filters"],
    products: storefrontProducts.filter((product) => product.category === "new-arrivals")
  }
};

export function getStorefrontProduct(slug: string) {
  return storefrontProducts.find((product) => product.slug === slug || product.slug.replace("-sofa", "") === slug);
}
