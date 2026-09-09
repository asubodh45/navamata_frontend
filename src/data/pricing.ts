import type { PricingTier } from "@/types";

export const pricingTiers: PricingTier[] = [
  {
    id: "viewer",
    name: "Viewer",
    price: 0,
    cadence: "Always free",
    description: "Sample the library and explore the world of Navamata.",
    features: ["Curated short practices", "Public sessions", "Editorial journal"],
  },
  {
    id: "explorer",
    name: "Explorer",
    price: 18,
    cadence: "per month",
    description: "Full access to the on-demand library and live community.",
    features: [
      "Entire on-demand library",
      "Weekly Go Live sessions",
      "Personal practice journal",
    ],
    highlighted: true,
  },
  {
    id: "practitioner",
    name: "Practitioner",
    price: 42,
    cadence: "per month",
    description: "For dedicated practice with one-to-one mentorship.",
    features: [
      "Everything in Explorer",
      "Monthly 1:1 with a teacher",
      "Personal curriculum",
    ],
  },
];
