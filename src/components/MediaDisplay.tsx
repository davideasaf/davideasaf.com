import { useEffect, useMemo, useState } from "react";
import type { NeuralNoteMetaWithCalculated, ProjectMeta } from "../lib/content";
import { getPrimaryMedia } from "../lib/content";

interface MediaDisplayProps {
  meta: NeuralNoteMetaWithCalculated | ProjectMeta;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
}

const TRUSTED_YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const isTrustedYouTubeHostname = (hostname: string) => {
  const normalized = hostname.toLowerCase();
  if (TRUSTED_YOUTUBE_HOSTS.has(normalized)) {
    return true;
  }

  return normalized.endsWith(".youtube.com") || normalized.endsWith(".youtube-nocookie.com");
};

const extractYouTubeId = (url: URL) => {
  if (url.hostname.includes("youtu.be")) {
    const candidate = url.pathname.split("/").filter(Boolean)[0];
    if (candidate && candidate.length === 11) {
      return candidate;
    }
  }

  const searchId = url.searchParams.get("v");
  if (searchId && searchId.length === 11) {
    return searchId;
  }

  const pathMatch = url.pathname.match(/\/(?:embed|shorts|v)\/([^/?]+)/);
  if (pathMatch?.[1] && pathMatch[1].length === 11) {
    return pathMatch[1];
  }

  return null;
};

const getYouTubeEmbedUrl = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl);
    if (!isTrustedYouTubeHostname(parsed.hostname)) {
      return null;
    }

    const videoId = extractYouTubeId(parsed);
    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
};

export function MediaDisplay({ meta, className = "", aspectRatio = "wide" }: MediaDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const media = useMemo(() => getPrimaryMedia(meta), [meta]);
  const videoEmbedUrl = useMemo(() => {
    if (media.type !== "video" || !media.url) {
      return null;
    }

    return getYouTubeEmbedUrl(media.url);
  }, [media]);

  useEffect(() => {
    if (!media.url) {
      return;
    }

    setIsLoaded(false);
    setHasError(false);
  }, [media.url]);

  useEffect(() => {
    if (media.type === "video" && media.url && !videoEmbedUrl) {
      setHasError(true);
    }
  }, [media.type, media.url, videoEmbedUrl]);

  if (!media.url || hasError) {
    return null; // Don't render anything if no media or error
  }

  const aspectClasses = {
    video: "aspect-video md:aspect-video",
    square: "aspect-square md:aspect-square",
    wide: "aspect-[4/3] md:aspect-[16/9]",
  };

  const baseClasses = `w-full ${aspectClasses[aspectRatio]} bg-gray-100 rounded-lg overflow-hidden ${className}`;

  if (media.type === "video") {
    if (!videoEmbedUrl) {
      return null;
    }

    return (
      <div className={baseClasses}>
        <iframe
          src={videoEmbedUrl}
          title={media.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (media.type === "banner" || media.type === "image") {
    return (
      <div className={baseClasses}>
        {!isLoaded && (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}
        <img
          src={media.url}
          alt={meta.title}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return null;
}
