import { memo, useEffect, useRef, useState } from "react";
import { ANALYTICS_EVENTS, captureEvent } from "../lib/analytics";
import type { NeuralNoteMetaWithCalculated, ProjectMeta } from "../lib/content";
import { getPrimaryMedia } from "../lib/content";
import type { MediaError } from "../lib/media";
import { AudioDisplay } from "./media/AudioDisplay";
import { ImageDisplay } from "./media/ImageDisplay";
import { VideoDisplay } from "./media/VideoDisplay";

interface MediaDisplayProps {
  meta: NeuralNoteMetaWithCalculated | ProjectMeta;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
}

function MediaDisplayComponent({ meta, className = "", aspectRatio = "wide" }: MediaDisplayProps) {
  const media = getPrimaryMedia(meta);
  const [error, setError] = useState<MediaError | null>(null);
  const prevMediaUrlRef = useRef<string | null>(null);

  // Reset error when media URL changes
  if (prevMediaUrlRef.current !== media.url) {
    prevMediaUrlRef.current = media.url;
    if (error) {
      setError(null);
    }
  }

  useEffect(() => {
    if (error) {
      captureEvent(ANALYTICS_EVENTS.MEDIA_RENDER_FAILED, {
        media_type: media.type,
        media_url: media.url ?? null,
        error_code: error.code,
        error_message: error.message,
        title: meta.title,
      });
    }
  }, [error, media.type, media.url, meta.title]);

  if (!media.url) {
    return null;
  }

  const aspectClasses = {
    video: "aspect-video md:aspect-video",
    square: "aspect-square md:aspect-square",
    wide: "aspect-[4/3] md:aspect-[16/9]",
  } as const;

  const isAudio = media.type === "audio";
  const aspectClass = isAudio ? "" : aspectClasses[aspectRatio];
  const baseClasses = isAudio
    ? `w-full rounded-lg ${className}`
    : `w-full ${aspectClass} bg-gray-100 rounded-lg overflow-hidden ${className}`;

  if (error) {
    return (
      <div
        className={`${baseClasses} flex items-center justify-center border border-destructive/30 bg-destructive/5 p-4`}
        role="alert"
        aria-live="assertive"
      >
        <div className="space-y-1 text-center text-sm text-destructive">
          <p className="font-medium">Media failed to load</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className={baseClasses}>
        <VideoDisplay
          url={media.url}
          title={media.title}
          metaTitle={meta.title}
          onError={(error) => setError(error)}
        />
      </div>
    );
  }

  if (media.type === "audio") {
    return (
      <div className={baseClasses}>
        <AudioDisplay src={media.url} metaTitle={meta.title} onError={(error) => setError(error)} />
      </div>
    );
  }

  if (media.type === "banner" || media.type === "image") {
    return (
      <div className={baseClasses}>
        <ImageDisplay
          src={media.url}
          alt={meta.title}
          metaTitle={meta.title}
          onError={(error) => setError(error)}
        />
      </div>
    );
  }

  return null;
}

export const MediaDisplay = memo(MediaDisplayComponent);
MediaDisplay.displayName = "MediaDisplay";
