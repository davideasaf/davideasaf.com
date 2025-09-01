import { useState } from "react";
import type { NeuralNoteMetaWithCalculated, ProjectMeta } from "../lib/content";
import { getPrimaryMedia } from "../lib/content";

interface MediaDisplayProps {
  meta: NeuralNoteMetaWithCalculated | ProjectMeta;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
}

export function MediaDisplay({ meta, className = "", aspectRatio = "wide" }: MediaDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const media = getPrimaryMedia(meta);

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
    // Extract video ID from YouTube URL for embed
    const getYouTubeEmbedUrl = (url: string) => {
      const match = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
      );
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };

    const embedUrl = getYouTubeEmbedUrl(media.url);

    return (
      <div className={baseClasses}>
        <iframe
          src={embedUrl}
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
