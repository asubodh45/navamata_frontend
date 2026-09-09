import type { Category, Program, LiveSession } from "@/types";

export const categories: Category[] = [
  {
    id: "c1",
    slug: "hatha",
    name: "Hatha",
    tagline: "Form, held quietly.",
    description: "Traditional postures studied slowly with detailed alignment.",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "c2",
    slug: "vinyasa",
    name: "Vinyasa",
    tagline: "Breath, in motion.",
    description: "Continuous sequences set to the cadence of the breath.",
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "c3",
    slug: "pranayama",
    name: "Pranayama",
    tagline: "The breath, as practice.",
    description: "Disciplined breath work drawn from classical lineages.",
    image:
      "https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "c4",
    slug: "meditation",
    name: "Meditation",
    tagline: "Sitting, simply.",
    description: "Guided and silent sittings, short and long.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "c5",
    slug: "restorative",
    name: "Restorative",
    tagline: "Supported, unhurried.",
    description: "Long-held, propped shapes for repair and rest.",
    image:
      "https://images.unsplash.com/photo-1593810451137-5dc55105dace?auto=format&fit=crop&w=1400&q=80",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export const programs: Program[] = [
  {
    id: "p1",
    title: "Twenty-Eight Mornings",
    weeks: 4,
    sessions: 28,
    image:
      "https://images.unsplash.com/photo-1552196527-bffefb1c4dac?auto=format&fit=crop&w=1200&q=80",
    description: "A four-week study to establish a morning practice that survives the seasons.",
  },
  {
    id: "p2",
    title: "The Quiet Spine",
    weeks: 6,
    sessions: 18,
    image:
      "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=1200&q=80",
    description: "A measured curriculum in spinal architecture and slow backbending.",
  },
  {
    id: "p3",
    title: "Foundations of Breath",
    weeks: 3,
    sessions: 12,
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=80",
    description: "An introduction to pranayama with Daichi Watanabe.",
  },
];

export const liveSessions: LiveSession[] = [
  {
    id: "l1",
    title: "Sunday Long Form",
    instructor: "Ines Moreau",
    date: "Sunday, 12 July",
    time: "08:00 CET",
    duration: "75 min",
    spots: 40,
    filled: 28,
    image:
      "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "l2",
    title: "Breath Studio",
    instructor: "Daichi Watanabe",
    date: "Wednesday, 15 July",
    time: "19:00 JST",
    duration: "45 min",
    spots: 30,
    filled: 22,
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "l3",
    title: "Restorative Evening",
    instructor: "Liev Sørensen",
    date: "Friday, 17 July",
    time: "20:00 CET",
    duration: "60 min",
    spots: 25,
    filled: 19,
    image:
      "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1200&q=80",
  },
];
