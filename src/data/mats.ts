import type { Mat } from "@/types";

// Backend only supports one flat mat price for now (mat_price_cents in
// platform settings, currently $199) — both finishes are cosmetic choices,
// not separate SKUs/prices. Update this if the backend setting changes.
export const MAT_PRICE_USD = 199;

export const mats: Mat[] = [
  {
    id: "mat-grey",
    name: "Navamata — Pearl",
    tagline: "Soft stone. Quiet strength.",
    description:
      "A natural rubber foundation finished in a warm pearl grey. Engineered for daily practice and built to outlast a decade of use.",
    price: MAT_PRICE_USD,
    currency: "USD",
    color: "grey",
    image:
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1200&q=80",
    specs: [
      { label: "Length", value: "188 cm" },
      { label: "Width", value: "66 cm" },
      { label: "Thickness", value: "5 mm" },
      { label: "Weight", value: "2.4 kg" },
      { label: "Material", value: "Natural tree rubber" },
    ],
  },
  {
    id: "mat-black",
    name: "Navamata — Obsidian",
    tagline: "Deep ground. Still center.",
    description:
      "Our signature obsidian finish. A grounding surface with refined alignment markers and a tactile, low-sheen top layer.",
    price: MAT_PRICE_USD,
    currency: "USD",
    color: "black",
    image:
      "https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=1200&q=80",
    specs: [
      { label: "Length", value: "188 cm" },
      { label: "Width", value: "66 cm" },
      { label: "Thickness", value: "6 mm" },
      { label: "Weight", value: "2.7 kg" },
      { label: "Material", value: "Natural tree rubber" },
    ],
  },
];
