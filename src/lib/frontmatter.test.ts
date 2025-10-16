import yaml from "js-yaml";
import { describe, expect, it } from "vitest";

describe("frontmatter parsing", () => {
  describe("YAML frontmatter extraction", () => {
    it("should parse valid YAML frontmatter", () => {
      const markdown = `---
title: "Test Post"
excerpt: "Test excerpt"
date: "2024-03-15"
author: "David Asaf"
tags: ["AI", "Testing"]
featured: true
---

Content here.`;

      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
      expect(match).not.toBeNull();

      const frontmatter = yaml.load(match?.[1]);
      expect(frontmatter).toMatchObject({
        title: "Test Post",
        excerpt: "Test excerpt",
        date: "2024-03-15",
        author: "David Asaf",
        tags: ["AI", "Testing"],
        featured: true,
      });
    });

    it("should extract all standard fields from neural note frontmatter", () => {
      const markdown = `---
title: "Complete Neural Note"
excerpt: "Full frontmatter example"
date: "2024-03-20"
author: "David Asaf"
tags: ["AI", "ML", "Testing"]
featured: true
hasVideo: false
hasAudio: true
audioUrl: "https://example.com/audio.mp3"
audioTitle: "Test Audio"
banner: "/images/banner.jpg"
draft: false
---

Content.`;

      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(frontmatter.title).toBe("Complete Neural Note");
      expect(frontmatter.excerpt).toBe("Full frontmatter example");
      expect(frontmatter.date).toBe("2024-03-20");
      expect(frontmatter.author).toBe("David Asaf");
      expect(frontmatter.tags).toEqual(["AI", "ML", "Testing"]);
      expect(frontmatter.featured).toBe(true);
      expect(frontmatter.hasVideo).toBe(false);
      expect(frontmatter.hasAudio).toBe(true);
      expect(frontmatter.audioUrl).toBe("https://example.com/audio.mp3");
      expect(frontmatter.audioTitle).toBe("Test Audio");
      expect(frontmatter.banner).toBe("/images/banner.jpg");
      expect(frontmatter.draft).toBe(false);
    });

    it("should extract all standard fields from project frontmatter", () => {
      const markdown = `---
title: "Test Project"
description: "Project description"
date: "2024-02-10"
tags: ["React", "TypeScript"]
github: "https://github.com/example/repo"
demo: "https://demo.example.com"
featured: true
status: "Active"
keyFeatures:
  - "Feature 1"
  - "Feature 2"
---

Content.`;

      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(frontmatter.title).toBe("Test Project");
      expect(frontmatter.description).toBe("Project description");
      expect(frontmatter.date).toBe("2024-02-10");
      expect(frontmatter.tags).toEqual(["React", "TypeScript"]);
      expect(frontmatter.github).toBe("https://github.com/example/repo");
      expect(frontmatter.demo).toBe("https://demo.example.com");
      expect(frontmatter.featured).toBe(true);
      expect(frontmatter.status).toBe("Active");
      expect(frontmatter.keyFeatures).toEqual(["Feature 1", "Feature 2"]);
    });

    it("should handle optional fields gracefully", () => {
      const markdown = `---
title: "Minimal Post"
date: "2024-03-01"
---

Content.`;

      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(frontmatter.title).toBe("Minimal Post");
      expect(frontmatter.date).toBe("2024-03-01");
      expect(frontmatter.featured).toBeUndefined();
      expect(frontmatter.videoUrl).toBeUndefined();
      expect(frontmatter.hasVideo).toBeUndefined();
    });

    it("should parse dates in various formats", () => {
      const formats = [
        "2024-03-15",
        "2024-03-15T10:30:00Z",
        "2024-03-15 10:30:00",
        "March 15, 2024",
      ];

      for (const dateStr of formats) {
        const markdown = `---
title: "Test"
date: "${dateStr}"
---

Content.`;

        const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
        const frontmatter = yaml.load(match?.[1]) as any;

        expect(frontmatter.date).toBeTruthy();
        // Should be parseable by Date constructor
        const parsed = new Date(frontmatter.date);
        expect(parsed.toString()).not.toBe("Invalid Date");
      }
    });

    it("should parse tags as arrays", () => {
      const markdownArray = `---
title: "Test"
tags: ["tag1", "tag2", "tag3"]
---

Content.`;

      const match = markdownArray.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(Array.isArray(frontmatter.tags)).toBe(true);
      expect(frontmatter.tags).toEqual(["tag1", "tag2", "tag3"]);
    });

    it("should handle YAML list syntax for tags", () => {
      const markdownList = `---
title: "Test"
tags:
  - tag1
  - tag2
  - tag3
---

Content.`;

      const match = markdownList.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(Array.isArray(frontmatter.tags)).toBe(true);
      expect(frontmatter.tags).toEqual(["tag1", "tag2", "tag3"]);
    });

    it("should return null match for missing frontmatter", () => {
      const markdown = "# Just content\n\nNo frontmatter here.";
      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);

      expect(match).toBeNull();
    });

    it("should throw error for malformed frontmatter", () => {
      const malformed = `---
title: "Test"
tags: [missing bracket
date: 2024-03-15
---

Content.`;

      const match = malformed.match(/^---\s*([\s\S]*?)\s*---/);
      expect(match).not.toBeNull();

      // YAML parsing should throw for malformed syntax
      expect(() => {
        yaml.load(match?.[1]);
      }).toThrow();
    });

    it("should handle empty frontmatter fields", () => {
      const incomplete = `---
title: "Test"
---

Content.`;

      const match = incomplete.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(frontmatter.title).toBeDefined();
      expect(frontmatter.date).toBeUndefined();
      expect(frontmatter.excerpt).toBeUndefined();
    });
  });

  describe("markdown content handling", () => {
    it("should detect markdown with code blocks", () => {
      const markdown = `---
title: "Code Example"
---

# Code Block Test

\`\`\`typescript
function example() {
  return "test";
}
\`\`\`

More content.`;

      expect(markdown).toContain("```typescript");
      expect(markdown).toContain("function example()");
    });

    it("should detect markdown with images", () => {
      const markdown = `---
title: "Image Test"
---

# Images

![Alt text](/images/test.jpg)

More content.`;

      expect(markdown).toContain("![Alt text]");
      expect(markdown).toContain("/images/test.jpg");
    });

    it("should parse markdown without frontmatter", () => {
      const markdown = "# Simple Post\n\nJust content.";
      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);

      expect(match).toBeNull();
      expect(markdown).toContain("# Simple Post");
    });

    it("should handle empty content after frontmatter", () => {
      const markdown = `---
title: "Empty"
date: "2024-03-01"
---`;

      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(frontmatter.title).toBe("Empty");
      expect(markdown.split("---")[2]).toBeFalsy();
    });

    it("should handle very long content", () => {
      const longContent = "word ".repeat(10000);
      const markdown = `---
title: "Long Post"
---

${longContent}`;

      expect(markdown).toContain("Long Post");
      expect(markdown.length).toBeGreaterThan(50000);
    });

    it("should handle special characters in frontmatter", () => {
      const markdown = `---
title: "Post with \\"quotes\\" and 'apostrophes'"
excerpt: "Special chars: @#$%^&*()"
---

Content.`;

      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(frontmatter.title).toContain("quotes");
      expect(frontmatter.excerpt).toContain("@#$%");
    });

    it("should handle unicode characters", () => {
      const markdown = `---
title: "Unicode Test: 你好 🎉"
---

Content with emoji: 🚀 and unicode: café`;

      const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
      const frontmatter = yaml.load(match?.[1]) as any;

      expect(frontmatter.title).toContain("你好");
      expect(frontmatter.title).toContain("🎉");
    });
  });
});
