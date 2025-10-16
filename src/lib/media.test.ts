import { describe, expect, it } from "vitest";
import type { ProjectMeta } from "./content";
import { getPrimaryMedia } from "./content";

// Helper to create minimal meta objects for testing
function createTestMeta(overrides: Partial<ProjectMeta> = {}): ProjectMeta {
  return {
    title: "Test Post",
    description: "",
    date: "2024-01-01",
    tags: [],
    featured: false,
    ...overrides,
  };
}

describe("media priority", () => {
  describe("getPrimaryMedia", () => {
    it("should prioritize video over other media types", () => {
      const meta = createTestMeta({
        videoUrl: "https://example.com/video.mp4",
        videoTitle: "Test Video",
        audioUrl: "https://example.com/audio.mp3",
        banner: "/images/banner.jpg",
      });

      const result = getPrimaryMedia(meta);

      expect(result.type).toBe("video");
      expect(result.url).toBe("https://example.com/video.mp4");
      expect(result.title).toBe("Test Video");
    });

    it("should use audio when video is not available", () => {
      const meta = createTestMeta({
        audioUrl: "https://example.com/audio.mp3",
        audioTitle: "Test Audio",
        banner: "/images/banner.jpg",
      });

      const result = getPrimaryMedia(meta);

      expect(result.type).toBe("audio");
      expect(result.url).toBe("https://example.com/audio.mp3");
      expect(result.title).toBe("Test Audio");
    });

    it("should use banner when video and audio are not available", () => {
      const meta = createTestMeta({
        banner: "/images/banner.jpg",
      });

      const result = getPrimaryMedia(meta);

      expect(result.type).toBe("banner");
      expect(result.url).toBe("/images/banner.jpg");
      expect(result.title).toBe("Test Post");
    });

    it("should use project image field as fallback", () => {
      const meta = createTestMeta({
        title: "Test Project",
        image: "/images/project.jpg",
      });

      const result = getPrimaryMedia(meta);

      expect(result.type).toBe("image");
      expect(result.url).toBe("/images/project.jpg");
      expect(result.title).toBe("Test Project");
    });

    it("should return null when no media is available", () => {
      const meta = createTestMeta();

      const result = getPrimaryMedia(meta);

      expect(result.type).toBeNull();
      expect(result.url).toBeNull();
    });

    it("should use title as fallback for audio title", () => {
      const meta = createTestMeta({
        audioUrl: "https://example.com/audio.mp3",
      });

      const result = getPrimaryMedia(meta);

      expect(result.type).toBe("audio");
      expect(result.title).toBe("Test Post");
    });

    it("should use default 'Video' title when videoTitle is not provided", () => {
      const meta = createTestMeta({
        videoUrl: "https://example.com/video.mp4",
      });

      const result = getPrimaryMedia(meta);

      expect(result.type).toBe("video");
      expect(result.title).toBe("Video");
    });

    it("should handle empty audioTitle by using post title", () => {
      const meta = createTestMeta({
        audioUrl: "https://example.com/audio.mp3",
        audioTitle: "   ",
      });

      const result = getPrimaryMedia(meta);

      expect(result.type).toBe("audio");
      expect(result.title).toBe("Test Post");
    });

    it("should prioritize banner over image", () => {
      const meta = createTestMeta({
        title: "Test Project",
        banner: "/images/banner.jpg",
        image: "/images/image.jpg",
      });

      const result = getPrimaryMedia(meta);

      expect(result.type).toBe("banner");
      expect(result.url).toBe("/images/banner.jpg");
    });

    it("should handle all media types present", () => {
      const meta = createTestMeta({
        title: "Complete Post",
        videoUrl: "https://example.com/video.mp4",
        videoTitle: "My Video",
        audioUrl: "https://example.com/audio.mp3",
        audioTitle: "My Audio",
        banner: "/images/banner.jpg",
        image: "/images/image.jpg",
      });

      const result = getPrimaryMedia(meta);

      // Video should win
      expect(result.type).toBe("video");
      expect(result.url).toBe("https://example.com/video.mp4");
      expect(result.title).toBe("My Video");
    });
  });
});
