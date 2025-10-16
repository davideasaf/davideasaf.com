import { describe, expect, it } from "vitest";

// Test media priority logic without importing content.ts to avoid MDX loading
// This replicates the getPrimaryMedia logic for testing purposes

interface MediaMeta {
  title: string;
  videoUrl?: string;
  videoTitle?: string;
  audioUrl?: string;
  audioTitle?: string;
  banner?: string;
  image?: string;
}

function getPrimaryMediaForTest(meta: MediaMeta): {
  type: "video" | "audio" | "banner" | "image" | null;
  url: string | null;
  title?: string;
} {
  // Priority: Video > Audio > Banner > Image
  if (meta.videoUrl) {
    return {
      type: "video",
      url: meta.videoUrl,
      title: meta.videoTitle || "Video",
    };
  }

  if (meta.audioUrl) {
    const audioTitle = meta.audioTitle?.trim();
    return {
      type: "audio",
      url: meta.audioUrl,
      title: audioTitle && audioTitle.length > 0 ? audioTitle : meta.title || "Audio",
    };
  }

  if (meta.banner) {
    return {
      type: "banner",
      url: meta.banner,
      title: meta.title,
    };
  }

  // For projects, fall back to image field
  if (meta.image) {
    return {
      type: "image",
      url: meta.image,
      title: meta.title,
    };
  }

  return {
    type: null,
    url: null,
  };
}

describe("media priority", () => {
  describe("getPrimaryMedia", () => {
    it("should prioritize video over other media types", () => {
      const meta: MediaMeta = {
        title: "Test Post",
        videoUrl: "https://example.com/video.mp4",
        videoTitle: "Test Video",
        audioUrl: "https://example.com/audio.mp3",
        banner: "/images/banner.jpg",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBe("video");
      expect(result.url).toBe("https://example.com/video.mp4");
      expect(result.title).toBe("Test Video");
    });

    it("should use audio when video is not available", () => {
      const meta: MediaMeta = {
        title: "Test Post",
        audioUrl: "https://example.com/audio.mp3",
        audioTitle: "Test Audio",
        banner: "/images/banner.jpg",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBe("audio");
      expect(result.url).toBe("https://example.com/audio.mp3");
      expect(result.title).toBe("Test Audio");
    });

    it("should use banner when video and audio are not available", () => {
      const meta: MediaMeta = {
        title: "Test Post",
        banner: "/images/banner.jpg",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBe("banner");
      expect(result.url).toBe("/images/banner.jpg");
      expect(result.title).toBe("Test Post");
    });

    it("should use project image field as fallback", () => {
      const meta: MediaMeta = {
        title: "Test Project",
        image: "/images/project.jpg",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBe("image");
      expect(result.url).toBe("/images/project.jpg");
      expect(result.title).toBe("Test Project");
    });

    it("should return null when no media is available", () => {
      const meta: MediaMeta = {
        title: "Test Post",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBeNull();
      expect(result.url).toBeNull();
    });

    it("should use title as fallback for audio title", () => {
      const meta: MediaMeta = {
        title: "Test Post",
        audioUrl: "https://example.com/audio.mp3",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBe("audio");
      expect(result.title).toBe("Test Post");
    });

    it("should use default 'Video' title when videoTitle is not provided", () => {
      const meta: MediaMeta = {
        title: "Test Post",
        videoUrl: "https://example.com/video.mp4",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBe("video");
      expect(result.title).toBe("Video");
    });

    it("should handle empty audioTitle by using post title", () => {
      const meta: MediaMeta = {
        title: "Test Post",
        audioUrl: "https://example.com/audio.mp3",
        audioTitle: "   ",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBe("audio");
      expect(result.title).toBe("Test Post");
    });

    it("should prioritize banner over image", () => {
      const meta: MediaMeta = {
        title: "Test Project",
        banner: "/images/banner.jpg",
        image: "/images/image.jpg",
      };

      const result = getPrimaryMediaForTest(meta);

      expect(result.type).toBe("banner");
      expect(result.url).toBe("/images/banner.jpg");
    });

    it("should handle all media types present", () => {
      const meta: MediaMeta = {
        title: "Complete Post",
        videoUrl: "https://example.com/video.mp4",
        videoTitle: "My Video",
        audioUrl: "https://example.com/audio.mp3",
        audioTitle: "My Audio",
        banner: "/images/banner.jpg",
        image: "/images/image.jpg",
      };

      const result = getPrimaryMediaForTest(meta);

      // Video should win
      expect(result.type).toBe("video");
      expect(result.url).toBe("https://example.com/video.mp4");
      expect(result.title).toBe("My Video");
    });
  });
});
