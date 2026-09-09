import type { ApiCategory, ApiVideo } from "@/lib/api";
import type { Category, VideoItem } from "@/types";

const FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80";
const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1200&q=80";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

/**
 * Maps a backend Video (see Video::toApiArray) onto the existing VideoItem
 * shape so the already-built VideoCard component can render live catalog
 * data without changes. `instructor` and `level` don't exist on the backend
 * model (there are no teachers in the Navamata model) — they're left blank
 * / defaulted rather than invented.
 */
export function apiVideoToVideoItem(video: ApiVideo): VideoItem {
  const locked = video.access_level !== "watch" && !video.can_watch;
  return {
    id: video.uuid,
    title: video.title,
    instructor: "",
    duration: formatDuration(video.duration_seconds),
    level: "Foundational",
    category: video.category?.name ?? "",
    thumbnail: video.thumbnail_url ?? FALLBACK_THUMBNAIL,
    description: video.description ?? undefined,
    isPremium: video.access_level !== "watch",
    accessLevel: video.access_level,
    canWatch: video.can_watch,
    purchased: video.purchased,
    priceCents: video.price_cents,
    progress: undefined,
  };
}

export function apiCategoryToCategory(category: ApiCategory): Category {
  return {
    id: category.slug,
    slug: category.slug,
    name: category.name,
    tagline: category.tagline ?? "",
    description: category.description ?? "",
    image: FALLBACK_CATEGORY_IMAGE,
  };
}

/** Human label + lock-badge copy for the three access tiers. */
export function accessLevelLabel(level: ApiVideo["access_level"]): string {
  switch (level) {
    case "watch":
      return "Watch";
    case "free_premium":
      return "Free Premium";
    case "paid_premium":
      return "Buy Premium";
  }
}
