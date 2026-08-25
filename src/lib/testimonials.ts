export type Testimonial = {
  name: string;
  location?: string;
  quote: string;
  rating: number;
};

// Add real customer reviews here (Google, Facebook, WhatsApp, etc.) — never invent quotes.
// Testimonials.tsx only renders once this array has entries, so it's safe to leave empty.
export const testimonials: Testimonial[] = [];
