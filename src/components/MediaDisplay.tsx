import { memo, useEffect, useMemo, useState } from "react";
import { ANALYTICS_EVENTS, captureEvent } from "../lib/analytics";
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

  const validDomains = [".youtube.com", ".youtube-nocookie.com"];
  return validDomains.some((domain) => {
    const naked = domain.slice(1);
    if (normalized === naked) {
      return true;
    }

    return (
      normalized.length > domain.length &&
      normalized.endsWith(domain) &&
      normalized.charAt(normalized.length - domain.length - 1) === "."
    );
  });
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

type MediaError = {
  code: "invalid-url" | "unsupported-host" | "invalid-id" | "image-load-error";
  message: string;
};

type VideoValidationResult =
  | { status: "success"; embedUrl: string }
  | { status: "error"; error: MediaError };

const validateYouTubeUrl = (rawUrl: string): VideoValidationResult => {
  try {
    const parsed = new URL(rawUrl);
    if (!isTrustedYouTubeHostname(parsed.hostname)) {
      return {
        status: "error",
        error: {
          code: "unsupported-host",
          message:
            "The video is hosted on an unverified domain, so it has been blocked for safety.",
        },
      };
    }

    const videoId = extractYouTubeId(parsed);
    if (!videoId) {
      return {
        status: "error",
        error: {
          code: "invalid-id",
          message: "We couldn't find a valid YouTube video identifier in the provided link.",
        },
      };
    }

    return {
      status: "success",
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    };
  } catch {
    return {
      status: "error",
      error: {
        code: "invalid-url",
        message: "The video link appears to be malformed. Please verify the URL and try again.",
      },
    };
  }
};

function MediaDisplayComponent({ meta, className = "", aspectRatio = "wide" }: MediaDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [error, setError] = useState<MediaError | null>(null);

  const media = useMemo(() => getPrimaryMedia(meta), [meta]);
  const videoValidation = useMemo(() => {
    if (media.type !== "video" || !media.url) {
      return { status: "idle" as const, embedUrl: null, error: null };
    }

    const result = validateYouTubeUrl(media.url);
    if (result.status === "success") {
      return { status: "success" as const, embedUrl: result.embedUrl, error: null };
    }

    return { status: "error" as const, embedUrl: null, error: result.error };
  }, [media]);

  useEffect(() => {
    if (!media.url) {
      setStatus("idle");
      setError(null);
      return;
    }

    if (media.type === "image" || media.type === "banner") {
      setStatus("loading");
    } else {
      setStatus("idle");
    }

    setIsLoaded(false);
    setError(videoValidation.error);
  }, [media.url, media.type, videoValidation.error]);

  useEffect(() => {
    if (error) {
      captureEvent(ANALYTICS_EVENTS.MEDIA_RENDER_FAILED, {
        media_type: media.type,
        media_url: media.url ?? null,
        error_code: error.code,
        error_message: error.message,
        title: meta.title,
      });
      setStatus("error");
    }
  }, [error, media.type, media.url, meta.title]);

  if (!media.url) {
    return null;
  }

  const aspectClasses = {
    video: "aspect-video md:aspect-video",
    square: "aspect-square md:aspect-square",
    wide: "aspect-[4/3] md:aspect-[16/9]",
  };

  const baseClasses = `w-full ${aspectClasses[aspectRatio]} bg-gray-100 rounded-lg overflow-hidden ${className}`;

  if (error) {
    return (
      <div
        className={`${baseClasses} flex items-center justify-center border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive`}
        role="alert"
        aria-live="assertive"
      >
        <div className="space-y-1 text-center">
          <p className="font-medium">We couldn't display this media.</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (media.type === "video") {
    if (videoValidation.status !== "success" || !videoValidation.embedUrl) {
      return null;
    }

    const label = media.title ? `${media.title} video` : "Embedded project video";

    return (
      <div className={baseClasses}>
        <iframe
          src={videoValidation.embedUrl}
          title={media.title}
          aria-label={label}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <div className="sr-only" aria-live="polite">
          Embedded video for {meta.title} loaded successfully.
        </div>
      </div>
    );
  }

  if (media.type === "banner" || media.type === "image") {
    return (
      <div className={baseClasses}>
        {status === "loading" && (
          <div className="sr-only" aria-live="polite">
            Loading media for {meta.title}
          </div>
        )}
        {!isLoaded && (
          <div
            className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center"
            aria-live="polite"
          >
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}
        <img
          src={media.url}
          alt={meta.title}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => {
            setIsLoaded(true);
            setStatus("loaded");
          }}
          onError={() => {
            setError({
              code: "image-load-error",
              message: "The image failed to load. Please refresh to try again.",
            });
            setStatus("error");
          }}
          loading="lazy"
        />
      </div>
    );
  }

  return null;
}

export const MediaDisplay = memo(MediaDisplayComponent);
MediaDisplay.displayName = "MediaDisplay";
