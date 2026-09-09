import { Link } from "@tanstack/react-router";
import { Play, Lock } from "lucide-react";
import type { VideoItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { accessLevelLabel } from "@/lib/catalogAdapters";

interface Props {
  video: VideoItem;
  variant?: "default" | "wide";
}

export function VideoCard({ video, variant = "default" }: Props) {
  const { isAuthenticated } = useAuth();

  // Videos loaded from the live API carry accessLevel/canWatch; fall back to
  // the old mock-data boolean for anything still using data/videos.ts.
  const hasLiveAccessInfo = video.accessLevel !== undefined;
  const locked = hasLiveAccessInfo ? !video.canWatch : video.isPremium && !isAuthenticated;
  const badgeLabel = hasLiveAccessInfo
    ? video.accessLevel === "watch"
      ? null
      : accessLevelLabel(video.accessLevel!)
    : video.isPremium
      ? "Members"
      : null;

  const aspect = variant === "wide" ? "aspect-[16/9]" : "aspect-[16/10]";

  return (
    <Link
      to="/mat/practice/$videoId"
      params={{ videoId: video.id }}
      className="group flex flex-col"
    >
      <div className={`relative ${aspect} overflow-hidden bg-muted`}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />

        {badgeLabel && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-soft-white/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-ink">
            <Lock className="h-2.5 w-2.5" /> {badgeLabel}
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-soft-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-soft-white/95 text-ink">
            {locked ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" fill="currentColor" />
            )}
          </span>
          {video.duration && (
            <span className="text-xs uppercase tracking-[0.22em]">{video.duration}</span>
          )}
        </div>

        {typeof video.progress === "number" && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-soft-white/25">
            <div className="h-full bg-soft-white" style={{ width: `${video.progress}%` }} />
          </div>
        )}
      </div>
      <div className="pt-4">
        <div className="eyebrow mb-1.5 capitalize">
          {video.category}
          {video.level && !hasLiveAccessInfo ? ` · ${video.level}` : ""}
        </div>
        <h3 className="font-display text-xl text-ink">{video.title}</h3>
        {video.instructor && <p className="mt-1 text-sm text-warm-gray">with {video.instructor}</p>}
      </div>
    </Link>
  );
}
