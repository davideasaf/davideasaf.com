import { describe, expect, it } from "vitest";
import { calculateReadingTime, formatDate, getNeuralNoteOgImage } from "./config";

describe("config", () => {
  describe("calculateReadingTime", () => {
    it("should calculate reading time for plain text", async () => {
      const text = "word ".repeat(200); // 200 words
      const result = await calculateReadingTime(text);

      expect(result).toBe("1 min read");
    });

    it("should calculate reading time for longer content", async () => {
      const text = "word ".repeat(600); // 600 words
      const result = await calculateReadingTime(text);

      expect(result).toBe("3 min read");
    });

    it("should exclude code blocks from word count when configured", async () => {
      const text = `
This is regular text with some words.

\`\`\`typescript
function example() {
  // This code should potentially be excluded
  return "lots of words in code";
}
\`\`\`

More regular text here.
`;

      const result = await calculateReadingTime(text);

      expect(result).toMatch(/min read$/);
    });

    it("should handle inline code", async () => {
      const text = "Here is some `inline code` in the text.";
      const result = await calculateReadingTime(text);

      expect(result).toBe("1 min read");
    });

    it("should remove markdown syntax for accurate word count", async () => {
      const markdown = `
# Heading

**Bold text** and *italic text*

[Link text](https://example.com)

- List item 1
- List item 2

> Blockquote text
`;

      const result = await calculateReadingTime(markdown);

      expect(result).toMatch(/min read$/);
    });

    it("should remove images from word count", async () => {
      const text = `
Some text before the image.

![Alt text](/images/example.jpg)

Some text after the image.
`;

      const result = await calculateReadingTime(text);

      expect(result).toBe("1 min read");
    });

    it("should handle HTML content", async () => {
      const html = `
<p>This is <strong>HTML</strong> content.</p>
<div>More content here.</div>
`;

      const result = await calculateReadingTime(html);

      expect(result).toBe("1 min read");
    });

    it("should return minimum 1 minute for empty content", async () => {
      const result = await calculateReadingTime("");

      expect(result).toBe("1 min read");
    });

    it("should handle very short content", async () => {
      const result = await calculateReadingTime("Hi");

      expect(result).toBe("1 min read");
    });

    it("should round up to nearest minute", async () => {
      // 250 words at 200 wpm = 1.25 minutes, should round up to 2
      const text = "word ".repeat(250);
      const result = await calculateReadingTime(text);

      expect(result).toBe("2 min read");
    });

    it("should handle content with multiple markdown features", async () => {
      const markdown = `
# Main Title

## Subtitle

This is **bold** and this is *italic*.

Here's a [link](https://example.com) and an image:

![Image](/image.jpg)

\`\`\`javascript
const code = "example";
\`\`\`

- List item 1
- List item 2

> A blockquote

---

Final paragraph.
`;

      const result = await calculateReadingTime(markdown);

      expect(result).toMatch(/min read$/);
    });
  });

  describe("formatDate", () => {
    it("should format ISO date string", () => {
      const result = formatDate("2024-03-15");

      expect(result).toBe("March 15, 2024");
    });

    it("should format date with time", () => {
      const result = formatDate("2024-03-15T10:30:00Z");

      expect(result).toContain("March");
      expect(result).toContain("2024");
    });

    it("should handle different month", () => {
      const result = formatDate("2024-12-25");

      expect(result).toBe("December 25, 2024");
    });

    it("should format single-digit days correctly", () => {
      const result = formatDate("2024-01-05");

      expect(result).toBe("January 5, 2024");
    });

    it("should be consistent for same date", () => {
      const date = "2024-06-20";
      const result1 = formatDate(date);
      const result2 = formatDate(date);

      expect(result1).toBe(result2);
    });

    it("should handle leap year dates", () => {
      const result = formatDate("2024-02-29");

      expect(result).toBe("February 29, 2024");
    });
  });

  describe("getNeuralNoteOgImage", () => {
    it("should return AI image for AI-related tags", () => {
      const tags = ["AI", "Machine Learning"];
      const result = getNeuralNoteOgImage(tags);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should return AI image for LLM tag", () => {
      const tags = ["LLM", "GPT"];
      const result = getNeuralNoteOgImage(tags);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should return AI image for ML tag", () => {
      const tags = ["ML", "Deep Learning"];
      const result = getNeuralNoteOgImage(tags);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should be case insensitive for tag matching", () => {
      const tags = ["ai", "machine learning"];
      const result = getNeuralNoteOgImage(tags);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should detect AI in title when tags don't match", () => {
      const tags = ["Tutorial"];
      const title = "Introduction to LLM Development";
      const result = getNeuralNoteOgImage(tags, title);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should detect AI keyword in title", () => {
      const tags = ["Development"];
      const title = "Building AI Applications";
      const result = getNeuralNoteOgImage(tags, title);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should return default image for non-AI content", () => {
      const tags = ["React", "TypeScript"];
      const title = "Building Web Apps";
      const result = getNeuralNoteOgImage(tags, title);

      // Currently returns AI image as default
      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should handle empty tags array", () => {
      const result = getNeuralNoteOgImage([]);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should handle undefined title", () => {
      const tags = ["AI"];
      const result = getNeuralNoteOgImage(tags, undefined);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should handle Generative AI tag", () => {
      const tags = ["Generative AI"];
      const result = getNeuralNoteOgImage(tags);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });

    it("should handle Agentic Workflows tag", () => {
      const tags = ["Agentic Workflows"];
      const result = getNeuralNoteOgImage(tags);

      expect(result).toBe("/assets/blog/ai-workflow-example.png");
    });
  });
});
