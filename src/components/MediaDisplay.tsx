import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const ASPECT_CLASSES: Record<NonNullable<MediaDisplayProps["aspectRatio"]>, string> = {
  video: "aspect-video md:aspect-video",
  square: "aspect-square md:aspect-square",
  wide: "aspect-[4/3] md:aspect-[16/9]",
};

function MediaDisplayComponent({ meta, className = "", aspectRatio = "wide" }: MediaDisplayProps) {
  const [error, setError] = useState<MediaError | null>(null);
  const mediaKeyRef = useRef<string | null>(null);

  const media = useMemo(() => getPrimaryMedia(meta), [meta]);

  useEffect(() => {
    const nextKey = `${media.type ?? "none"}::${media.url ?? "none"}`;
    if (mediaKeyRef.current !== nextKey) {
      setError(null);
      mediaKeyRef.current = nextKey;
    }
  }, [media.type, media.url]);

  useEffect(() => {
    if (!error) {
      return;
    }

    captureEvent(ANALYTICS_EVENTS.MEDIA_RENDER_FAILED, {
      media_type: media.type,
      media_url: media.url ?? null,
      error_code: error.code,
      error_message: error.message,
      title: meta.title,
    });
  }, [error, media.type, media.url, meta.title]);

  const handleError = useCallback((err: MediaError) => {
    setError(err);
  }, []);

  if (!media.url || !media.type) {
    return null;
  }

  const baseClasses = `relative w-full ${ASPECT_CLASSES[aspectRatio]} rounded-lg bg-gray-100 overflow-hidden ${className}`;

  if (error) {
    const errorClasses = [
      baseClasses,
      "flex",
      "items-center",
      "justify-center",
      "border",
      "border-destructive/30",
      "bg-destructive/5",
      "p-4",
      "text-sm",
      "text-destructive",
    ].join(" ");

    return (
      <div className={errorClasses} role="alert" aria-live="assertive">
        <div className="space-y-1 text-center">
          <p className="font-medium">We couldn't display this media.</p>
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
          onError={handleError}
        />
      </div>
    );
  }

  if (media.type === "audio") {
    return (
      <div className={baseClasses}>
        <AudioDisplay src={media.url} metaTitle={meta.title} onError={handleError} />
      </div>
    );
  }

  if (media.type === "banner" || media.type === "image") {
    return (
      <div className={baseClasses}>
        <ImageDisplay
          src={media.url}
          alt={media.title ?? meta.title}
          metaTitle={meta.title}
          onError={handleError}
        />
      </div>
    );
  }

  return null;
}

export const MediaDisplay = memo(MediaDisplayComponent);
MediaDisplay.displayName = "MediaDisplay";
