export const TRUSTED_YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const VALID_YOUTUBE_DOMAINS = ["youtube.com", "youtube-nocookie.com"] as const;

export const isTrustedYouTubeHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase();
  if (TRUSTED_YOUTUBE_HOSTS.has(normalized)) {
    return true;
  }

  return VALID_YOUTUBE_DOMAINS.some((domain) => {
    if (normalized === domain) {
      return true;
    }

    const dottedDomain = `.${domain}`;
    if (!normalized.endsWith(dottedDomain)) {
      return false;
    }

    const prefix = normalized.slice(0, -dottedDomain.length);
    return prefix.length > 0 && prefix.split(".").every(Boolean);
  });
};

export const extractYouTubeId = (url: URL): string | null => {
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

export type MediaErrorCode =
  | "invalid-url"
  | "unsupported-host"
  | "invalid-id"
  | "image-load-error"
  | "audio-load-error";

export interface MediaError {
  code: MediaErrorCode;
  message: string;
}

type VideoValidationSuccess = {
  status: "success";
  embedUrl: string;
};

type VideoValidationFailure = {
  status: "error";
  error: MediaError;
};

export type VideoValidationResult = VideoValidationSuccess | VideoValidationFailure;

export const validateYouTubeUrl = (rawUrl: string): VideoValidationResult => {
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
      } satisfies VideoValidationFailure;
    }

    const videoId = extractYouTubeId(parsed);
    if (!videoId) {
      return {
        status: "error",
        error: {
          code: "invalid-id",
          message: "We couldn't find a valid YouTube video identifier in the provided link.",
        },
      } satisfies VideoValidationFailure;
    }

    return {
      status: "success",
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    } satisfies VideoValidationSuccess;
  } catch {
    return {
      status: "error",
      error: {
        code: "invalid-url",
        message: "The video link appears to be malformed. Please verify the URL and try again.",
      },
    } satisfies VideoValidationFailure;
  }
};
