import { memo } from "react";

import type { MediaError } from "@/lib/media";

interface AudioDisplayProps {
  src: string;
  metaTitle: string;
  onError: (error: MediaError) => void;
}

function AudioDisplayComponent({ src, metaTitle, onError }: AudioDisplayProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950/5 p-4">
      <audio
        src={src}
        controls
        className="w-full"
        onError={() => {
          onError({
            code: "audio-load-error",
            message: "The audio failed to load. Please try again later.",
          });
        }}
      >
        <track kind="captions" />
      </audio>
      <div className="sr-only" aria-live="polite">
        Audio player for {metaTitle}
      </div>
    </div>
  );
}

export const AudioDisplay = memo(AudioDisplayComponent);
AudioDisplay.displayName = "AudioDisplay";
