import { memo, useEffect, useMemo } from "react";

import type { MediaError } from "@/lib/media";
import { validateYouTubeUrl } from "@/lib/media";

interface VideoDisplayProps {
  url: string;
  title?: string;
  metaTitle: string;
  onError: (error: MediaError) => void;
}

function VideoDisplayComponent({ url, title, metaTitle, onError }: VideoDisplayProps) {
  const validation = useMemo(() => validateYouTubeUrl(url), [url]);

  useEffect(() => {
    if (validation.status === "error") {
      onError(validation.error);
    }
  }, [onError, validation]);

  if (validation.status !== "success") {
    return null;
  }

  const label = title ? `${title} video` : "Embedded project video";
  const iframeTitle = title ?? `${metaTitle} video`;

  return (
    <>
      <iframe
        src={validation.embedUrl}
        title={iframeTitle}
        aria-label={label}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
      <div className="sr-only" aria-live="polite">
        Embedded video for {metaTitle} loaded successfully.
      </div>
    </>
  );
}

export const VideoDisplay = memo(VideoDisplayComponent);
VideoDisplay.displayName = "VideoDisplay";
