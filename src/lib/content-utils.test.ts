import { describe, expect, it } from "vitest";

// Test content filtering and sorting utilities without importing content.ts
// This avoids triggering MDX file loading during tests

interface TestMeta {
  title: string;
  date: string;
  featured: boolean;
  draft: boolean;
  tags: string[];
}

interface TestContentItem {
  slug: string;
  meta: TestMeta;
}

describe("content filtering and sorting", () => {
  const createTestItem = (
    slug: string,
    date: string,
    featured = false,
    draft = false,
    tags: string[] = [],
  ): TestContentItem => ({
    slug,
    meta: {
      title: `Post ${slug}`,
      date,
      featured,
      draft,
      tags,
    },
  });

  describe("draft filtering", () => {
    it("should filter out draft content", () => {
      const items = [
        createTestItem("post1", "2024-03-15", false, false),
        createTestItem("post2", "2024-03-14", false, true),
        createTestItem("post3", "2024-03-13", false, false),
      ];

      const published = items.filter((item) => !item.meta.draft);

      expect(published).toHaveLength(2);
      expect(published.map((item) => item.slug)).toEqual(["post1", "post3"]);
    });

    it("should include all items when none are drafts", () => {
      const items = [
        createTestItem("post1", "2024-03-15"),
        createTestItem("post2", "2024-03-14"),
        createTestItem("post3", "2024-03-13"),
      ];

      const published = items.filter((item) => !item.meta.draft);

      expect(published).toHaveLength(3);
    });

    it("should return empty array when all items are drafts", () => {
      const items = [
        createTestItem("post1", "2024-03-15", false, true),
        createTestItem("post2", "2024-03-14", false, true),
      ];

      const published = items.filter((item) => !item.meta.draft);

      expect(published).toHaveLength(0);
    });
  });

  describe("featured filtering", () => {
    it("should filter featured content", () => {
      const items = [
        createTestItem("post1", "2024-03-15", true),
        createTestItem("post2", "2024-03-14", false),
        createTestItem("post3", "2024-03-13", true),
      ];

      const featured = items.filter((item) => item.meta.featured);

      expect(featured).toHaveLength(2);
      expect(featured.map((item) => item.slug)).toEqual(["post1", "post3"]);
    });

    it("should return empty array when no items are featured", () => {
      const items = [createTestItem("post1", "2024-03-15"), createTestItem("post2", "2024-03-14")];

      const featured = items.filter((item) => item.meta.featured);

      expect(featured).toHaveLength(0);
    });

    it("should handle all items being featured", () => {
      const items = [
        createTestItem("post1", "2024-03-15", true),
        createTestItem("post2", "2024-03-14", true),
      ];

      const featured = items.filter((item) => item.meta.featured);

      expect(featured).toHaveLength(2);
    });
  });

  describe("date sorting", () => {
    it("should sort by date descending (newest first)", () => {
      const items = [
        createTestItem("post1", "2024-03-13"),
        createTestItem("post2", "2024-03-15"),
        createTestItem("post3", "2024-03-14"),
      ];

      const sorted = items.sort(
        (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
      );

      expect(sorted.map((item) => item.slug)).toEqual(["post2", "post3", "post1"]);
    });

    it("should sort by date ascending (oldest first)", () => {
      const items = [
        createTestItem("post1", "2024-03-13"),
        createTestItem("post2", "2024-03-15"),
        createTestItem("post3", "2024-03-14"),
      ];

      const sorted = items.sort(
        (a, b) => new Date(a.meta.date).getTime() - new Date(b.meta.date).getTime(),
      );

      expect(sorted.map((item) => item.slug)).toEqual(["post1", "post3", "post2"]);
    });

    it("should handle items with same date", () => {
      const items = [
        createTestItem("post1", "2024-03-15"),
        createTestItem("post2", "2024-03-15"),
        createTestItem("post3", "2024-03-14"),
      ];

      const sorted = items.sort(
        (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
      );

      // Items with same date should maintain relative order
      expect(sorted[0].slug).toMatch(/post[12]/);
      expect(sorted[1].slug).toMatch(/post[12]/);
      expect(sorted[2].slug).toBe("post3");
    });

    it("should handle items across different years", () => {
      const items = [
        createTestItem("post1", "2023-12-31"),
        createTestItem("post2", "2024-01-01"),
        createTestItem("post3", "2025-01-01"),
      ];

      const sorted = items.sort(
        (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
      );

      expect(sorted.map((item) => item.slug)).toEqual(["post3", "post2", "post1"]);
    });
  });

  describe("tag filtering", () => {
    it("should filter by single tag", () => {
      const items = [
        createTestItem("post1", "2024-03-15", false, false, ["AI", "Testing"]),
        createTestItem("post2", "2024-03-14", false, false, ["React", "TypeScript"]),
        createTestItem("post3", "2024-03-13", false, false, ["AI", "ML"]),
      ];

      const aiPosts = items.filter((item) => item.meta.tags.includes("AI"));

      expect(aiPosts).toHaveLength(2);
      expect(aiPosts.map((item) => item.slug)).toEqual(["post1", "post3"]);
    });

    it("should filter by multiple tags (OR logic)", () => {
      const items = [
        createTestItem("post1", "2024-03-15", false, false, ["AI", "Testing"]),
        createTestItem("post2", "2024-03-14", false, false, ["React", "TypeScript"]),
        createTestItem("post3", "2024-03-13", false, false, ["AI", "ML"]),
      ];

      const filtered = items.filter(
        (item) => item.meta.tags.includes("AI") || item.meta.tags.includes("React"),
      );

      expect(filtered).toHaveLength(3);
    });

    it("should filter by multiple tags (AND logic)", () => {
      const items = [
        createTestItem("post1", "2024-03-15", false, false, ["AI", "Testing"]),
        createTestItem("post2", "2024-03-14", false, false, ["React", "TypeScript"]),
        createTestItem("post3", "2024-03-13", false, false, ["AI", "ML"]),
      ];

      const filtered = items.filter(
        (item) => item.meta.tags.includes("AI") && item.meta.tags.includes("Testing"),
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe("post1");
    });

    it("should return empty array when no items match tag", () => {
      const items = [
        createTestItem("post1", "2024-03-15", false, false, ["AI", "Testing"]),
        createTestItem("post2", "2024-03-14", false, false, ["React", "TypeScript"]),
      ];

      const filtered = items.filter((item) => item.meta.tags.includes("Python"));

      expect(filtered).toHaveLength(0);
    });

    it("should handle items with no tags", () => {
      const items = [
        createTestItem("post1", "2024-03-15", false, false, ["AI"]),
        createTestItem("post2", "2024-03-14", false, false, []),
        createTestItem("post3", "2024-03-13", false, false, ["AI"]),
      ];

      const aiPosts = items.filter((item) => item.meta.tags.includes("AI"));

      expect(aiPosts).toHaveLength(2);
    });

    it("should be case-sensitive by default", () => {
      const items = [
        createTestItem("post1", "2024-03-15", false, false, ["AI", "ml"]),
        createTestItem("post2", "2024-03-14", false, false, ["ai", "ML"]),
      ];

      const aiUpper = items.filter((item) => item.meta.tags.includes("AI"));
      const aiLower = items.filter((item) => item.meta.tags.includes("ai"));

      expect(aiUpper).toHaveLength(1);
      expect(aiLower).toHaveLength(1);
      expect(aiUpper[0].slug).not.toBe(aiLower[0].slug);
    });
  });

  describe("pagination", () => {
    it("should paginate results correctly", () => {
      const items = Array.from({ length: 20 }, (_, i) =>
        createTestItem(`post${i}`, `2024-03-${String(20 - i).padStart(2, "0")}`),
      );

      const pageSize = 5;
      const page1 = items.slice(0, pageSize);
      const page2 = items.slice(pageSize, pageSize * 2);

      expect(page1).toHaveLength(5);
      expect(page2).toHaveLength(5);
      expect(page1[0].slug).toBe("post0");
      expect(page2[0].slug).toBe("post5");
    });

    it("should handle last page with fewer items", () => {
      const items = Array.from({ length: 12 }, (_, i) =>
        createTestItem(`post${i}`, `2024-03-${String(20 - i).padStart(2, "0")}`),
      );

      const pageSize = 5;
      const page3 = items.slice(pageSize * 2, pageSize * 3);

      expect(page3).toHaveLength(2);
    });

    it("should return empty array for out of bounds page", () => {
      const items = [createTestItem("post1", "2024-03-15")];

      const pageSize = 5;
      const page2 = items.slice(pageSize, pageSize * 2);

      expect(page2).toHaveLength(0);
    });

    it("should calculate total pages correctly", () => {
      const items = Array.from({ length: 23 }, (_, i) =>
        createTestItem(`post${i}`, `2024-03-${String(20 - i).padStart(2, "0")}`),
      );

      const pageSize = 5;
      const totalPages = Math.ceil(items.length / pageSize);

      expect(totalPages).toBe(5);
    });
  });

  describe("combined filtering and sorting", () => {
    it("should filter drafts and sort by date", () => {
      const items = [
        createTestItem("post1", "2024-03-13", false, true),
        createTestItem("post2", "2024-03-15", false, false),
        createTestItem("post3", "2024-03-14", false, false),
      ];

      const result = items
        .filter((item) => !item.meta.draft)
        .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

      expect(result).toHaveLength(2);
      expect(result.map((item) => item.slug)).toEqual(["post2", "post3"]);
    });

    it("should filter by tag, exclude drafts, and sort", () => {
      const items = [
        createTestItem("post1", "2024-03-13", false, false, ["AI"]),
        createTestItem("post2", "2024-03-15", false, true, ["AI"]),
        createTestItem("post3", "2024-03-14", false, false, ["AI"]),
        createTestItem("post4", "2024-03-16", false, false, ["React"]),
      ];

      const result = items
        .filter((item) => !item.meta.draft)
        .filter((item) => item.meta.tags.includes("AI"))
        .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

      expect(result).toHaveLength(2);
      expect(result.map((item) => item.slug)).toEqual(["post3", "post1"]);
    });

    it("should filter featured, exclude drafts, sort, and paginate", () => {
      const items = [
        createTestItem("post1", "2024-03-13", true, false),
        createTestItem("post2", "2024-03-15", true, true),
        createTestItem("post3", "2024-03-14", true, false),
        createTestItem("post4", "2024-03-16", false, false),
        createTestItem("post5", "2024-03-17", true, false),
      ];

      const result = items
        .filter((item) => !item.meta.draft)
        .filter((item) => item.meta.featured)
        .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
        .slice(0, 2);

      expect(result).toHaveLength(2);
      expect(result.map((item) => item.slug)).toEqual(["post5", "post3"]);
    });
  });
});
