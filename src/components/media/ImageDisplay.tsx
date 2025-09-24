import { memo, useEffect, useState } from "react";

import type { MediaError } from "@/lib/media";

interface ImageDisplayProps {
  src: string;
  alt: string;
  metaTitle: string;
  onError: (error: MediaError) => void;
}

function ImageDisplayComponent({ src, alt, metaTitle, onError }: ImageDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoaded(false);
      return;
    }

    setIsLoaded(false);
  }, [src]);

  return (
    <div className="relative h-full w-full">
      {!isLoaded && (
        <div
          className="flex h-full w-full items-center justify-center bg-gray-200 animate-pulse"
          aria-live="polite"
        >
          <div className="text-sm text-gray-400">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover object-center transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setIsLoaded(true);
        }}
        onError={() => {
          onError({
            code: "image-load-error",
            message: "The image failed to load. Please refresh to try again.",
          });
        }}
        loading="lazy"
      />
      <div className="sr-only" aria-live="polite">
        {isLoaded
          ? `Media for ${metaTitle} loaded successfully.`
          : `Loading media for ${metaTitle}`}
      </div>
    </div>
  );
}

export const ImageDisplay = memo(ImageDisplayComponent);
ImageDisplay.displayName = "ImageDisplay";
