import type { VideoItem } from "@/types";

export const videos: VideoItem[] = [
  {
    id: "v1",
    title: "Morning Foundations",
    instructor: "Ines Moreau",
    duration: "28 min",
    level: "Foundational",
    category: "hatha",
    thumbnail:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    description:
      "A grounding sequence to begin the day. Built around six anchor postures and slow nasal breathing.",
    progress: 42,
  },
  {
    id: "v2",
    title: "Breath as Anchor",
    instructor: "Daichi Watanabe",
    duration: "42 min",
    level: "Intermediate",
    category: "pranayama",
    thumbnail:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=80",
    description:
      "A measured pranayama session — three breath ratios introduced and held over forty minutes.",
    isPremium: true,
  },
  {
    id: "v3",
    title: "Slow Vinyasa",
    instructor: "Amara Okafor",
    duration: "55 min",
    level: "Intermediate",
    category: "vinyasa",
    thumbnail:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1200&q=80",
    description:
      "Continuous, unhurried movement. The breath leads; the postures arrive in their own time.",
    progress: 18,
  },
  {
    id: "v4",
    title: "Stillness Practice",
    instructor: "Liev Sørensen",
    duration: "18 min",
    level: "Foundational",
    category: "meditation",
    thumbnail:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    description:
      "A short, seated meditation centred on the rhythm of the breath at the threshold of the nostrils.",
  },
  {
    id: "v5",
    title: "Long Hold Restorative",
    instructor: "Ines Moreau",
    duration: "62 min",
    level: "Foundational",
    category: "restorative",
    thumbnail:
      "https://images.unsplash.com/photo-1593810451137-5dc55105dace?auto=format&fit=crop&w=1200&q=80",
    description:
      "Five supported shapes, each held for eight minutes. A practice in dissolving effort.",
    isPremium: true,
  },
  {
    id: "v6",
    title: "Architecture of the Spine",
    instructor: "Amara Okafor",
    duration: "48 min",
    level: "Advanced",
    category: "hatha",
    thumbnail:
      "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=1200&q=80",
    description:
      "A study of the vertebral column through twelve precise postures and detailed alignment cues.",
    isPremium: true,
  },
  {
    id: "v7",
    title: "Evening Unwinding",
    instructor: "Liev Sørensen",
    duration: "32 min",
    level: "Foundational",
    category: "restorative",
    thumbnail:
      "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1200&q=80",
    description: "Soft floor work to release the hips and shoulders before sleep.",
  },
  {
    id: "v8",
    title: "Counting the Breath",
    instructor: "Daichi Watanabe",
    duration: "22 min",
    level: "Foundational",
    category: "meditation",
    thumbnail:
      "https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1200&q=80",
    description: "A traditional Zen counting practice to settle a busy mind.",
  },
];

export function getVideoById(id: string) {
  return videos.find((v) => v.id === id);
}

export function getRelated(id: string, limit = 3) {
  const v = getVideoById(id);
  if (!v) return [];
  return videos.filter((x) => x.id !== id && x.category === v.category).slice(0, limit);
}
