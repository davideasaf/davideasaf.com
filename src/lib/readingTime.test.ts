import { describe, expect, it } from "vitest";
import { readingTimeFromText, stripFrontMatter } from "./readingTime";

describe("readingTime", () => {
  describe("readingTimeFromText", () => {
    it("should calculate reading time for a short text (< 500 words)", () => {
      const text = "This is a short text with exactly ten words here.";
      const result = readingTimeFromText(text);
      expect(result).toBe("1 min read");
    });

    it("should calculate reading time for medium text (500-2000 words)", () => {
      // Create a 400-word text (should be ~2 minutes at 200 wpm)
      const words = new Array(400).fill("word").join(" ");
      const result = readingTimeFromText(words);
      expect(result).toBe("2 min read");
    });

    it("should calculate reading time for medium-large text", () => {
      // Create a 1000-word text (should be ~5 minutes at 200 wpm)
      const words = new Array(1000).fill("word").join(" ");
      const result = readingTimeFromText(words);
      expect(result).toBe("5 min read");
    });

    it("should calculate reading time for long text (> 2000 words)", () => {
      // Create a 2500-word text (should be ~13 minutes at 200 wpm)
      const words = new Array(2500).fill("word").join(" ");
      const result = readingTimeFromText(words);
      expect(result).toBe("13 min read");
    });

    it("should handle empty strings", () => {
      const result = readingTimeFromText("");
      expect(result).toBe("1 min read");
    });

    it("should handle strings with only whitespace", () => {
      const result = readingTimeFromText("   \n  \t  ");
      expect(result).toBe("1 min read");
    });

    it("should calculate minimum 1 minute for very short text", () => {
      const result = readingTimeFromText("Hi");
      expect(result).toBe("1 min read");
    });

    it("should handle text with multiple spaces between words", () => {
      const text = "This    has    multiple    spaces    between    words";
      const result = readingTimeFromText(text);
      expect(result).toBe("1 min read");
    });

    it("should round to nearest minute", () => {
      // 150 words = 0.75 minutes at 200 wpm, should round to 1
      const words = new Array(150).fill("word").join(" ");
      const result = readingTimeFromText(words);
      expect(result).toBe("1 min read");
    });

    it("should handle HTML content by counting text only", () => {
      const htmlText = "<p>This is <strong>HTML</strong> content with <em>tags</em></p>";
      const result = readingTimeFromText(htmlText);
      expect(result).toBe("1 min read");
    });

    it("should be consistent between multiple calls with same content", () => {
      const text = new Array(300).fill("word").join(" ");
      const result1 = readingTimeFromText(text);
      const result2 = readingTimeFromText(text);
      expect(result1).toBe(result2);
    });
  });

  describe("stripFrontMatter", () => {
    it("should remove YAML frontmatter from markdown", () => {
      const markdown = `---
title: Test Post
date: 2024-01-01
---

This is the content.`;

      const result = stripFrontMatter(markdown);
      expect(result).toBe("This is the content.");
    });

    it("should handle markdown without frontmatter", () => {
      const markdown = "This is just content without frontmatter.";
      const result = stripFrontMatter(markdown);
      expect(result).toBe(markdown);
    });

    it("should handle empty strings", () => {
      const result = stripFrontMatter("");
      expect(result).toBe("");
    });

    it("should handle frontmatter with complex content", () => {
      const markdown = `---
title: Test
tags:
  - tag1
  - tag2
---

Content here.`;

      const result = stripFrontMatter(markdown);
      expect(result).toBe("Content here.");
    });
  });
});
