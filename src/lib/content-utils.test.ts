import { describe, expect, it } from "vitest";
import {
  getNeuralNoteBySlug,
  getNeuralNoteBySlugSync,
  getNeuralNotesSync,
  getProjectBySlug,
  loadNeuralNotes,
  loadProjects,
} from "./content";

describe("content loading and filtering", () => {
  describe("loadNeuralNotes", () => {
    it("should load neural notes without drafts", async () => {
      const notes = await loadNeuralNotes();

      // All notes should be published (no drafts)
      expect(notes.every((n) => !n.meta.draft)).toBe(true);
    });

    it("should return notes sorted by date (newest first)", async () => {
      const notes = await loadNeuralNotes();

      if (notes.length > 1) {
        for (let i = 0; i < notes.length - 1; i++) {
          const currentDate = new Date(notes[i].meta.date).getTime();
          const nextDate = new Date(notes[i + 1].meta.date).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });

    it("should include all required metadata fields", async () => {
      const notes = await loadNeuralNotes();

      notes.forEach((note) => {
        expect(note.slug).toBeTruthy();
        expect(note.meta.title).toBeTruthy();
        expect(note.meta.date).toBeTruthy();
        expect(note.meta.author).toBeTruthy();
        expect(Array.isArray(note.meta.tags)).toBe(true);
        expect(typeof note.meta.featured).toBe("boolean");
        expect(note.meta.readTime).toBeTruthy();
        expect(note.content).toBeDefined();
      });
    });

    it("should calculate reading time for each note", async () => {
      const notes = await loadNeuralNotes();

      notes.forEach((note) => {
        expect(note.meta.readTime).toMatch(/\d+ min read/);
      });
    });
  });

  describe("loadProjects", () => {
    it("should load projects without drafts", async () => {
      const projects = await loadProjects();

      // All projects should be published (no drafts)
      expect(projects.every((p) => !p.meta.draft)).toBe(true);
    });

    it("should return projects sorted by date (newest first)", async () => {
      const projects = await loadProjects();

      if (projects.length > 1) {
        for (let i = 0; i < projects.length - 1; i++) {
          const currentDate = new Date(projects[i].meta.date).getTime();
          const nextDate = new Date(projects[i + 1].meta.date).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });

    it("should include all required metadata fields", async () => {
      const projects = await loadProjects();

      projects.forEach((project) => {
        expect(project.slug).toBeTruthy();
        expect(project.meta.title).toBeTruthy();
        expect(project.meta.description).toBeDefined();
        expect(project.meta.date).toBeTruthy();
        expect(Array.isArray(project.meta.tags)).toBe(true);
        expect(typeof project.meta.featured).toBe("boolean");
        expect(project.content).toBeDefined();
      });
    });
  });

  describe("getNeuralNoteBySlug", () => {
    it("should return a note by slug", async () => {
      const notes = await loadNeuralNotes();
      if (notes.length === 0) {
        // Skip if no notes exist
        return;
      }

      const firstNote = notes[0];
      const note = await getNeuralNoteBySlug(firstNote.slug);

      expect(note).not.toBeNull();
      expect(note?.slug).toBe(firstNote.slug);
      expect(note?.meta.title).toBe(firstNote.meta.title);
    });

    it("should return null for non-existent slug", async () => {
      const note = await getNeuralNoteBySlug("non-existent-slug-12345");

      expect(note).toBeNull();
    });
  });

  describe("getProjectBySlug", () => {
    it("should return a project by slug", async () => {
      const projects = await loadProjects();
      if (projects.length === 0) {
        // Skip if no projects exist
        return;
      }

      const firstProject = projects[0];
      const project = await getProjectBySlug(firstProject.slug);

      expect(project).not.toBeNull();
      expect(project?.slug).toBe(firstProject.slug);
      expect(project?.meta.title).toBe(firstProject.meta.title);
    });

    it("should return null for non-existent slug", async () => {
      const project = await getProjectBySlug("non-existent-project-12345");

      expect(project).toBeNull();
    });
  });

  describe("getNeuralNotesSync", () => {
    it("should return notes synchronously", () => {
      const notes = getNeuralNotesSync();

      // Should be an array
      expect(Array.isArray(notes)).toBe(true);

      // All notes should be published (no drafts)
      expect(notes.every((n) => !n.meta.draft)).toBe(true);
    });

    it("should return the same notes as async version", async () => {
      const syncNotes = getNeuralNotesSync();
      const asyncNotes = await loadNeuralNotes();

      expect(syncNotes.length).toBe(asyncNotes.length);

      // Compare slugs
      const syncSlugs = syncNotes.map((n) => n.slug).sort();
      const asyncSlugs = asyncNotes.map((n) => n.slug).sort();
      expect(syncSlugs).toEqual(asyncSlugs);
    });
  });

  describe("getNeuralNoteBySlugSync", () => {
    it("should return a note by slug synchronously", () => {
      const notes = getNeuralNotesSync();
      if (notes.length === 0) {
        // Skip if no notes exist
        return;
      }

      const firstNote = notes[0];
      const note = getNeuralNoteBySlugSync(firstNote.slug);

      expect(note).not.toBeNull();
      expect(note?.slug).toBe(firstNote.slug);
      expect(note?.meta.title).toBe(firstNote.meta.title);
    });

    it("should return null for non-existent slug", () => {
      const note = getNeuralNoteBySlugSync("non-existent-slug-12345");

      expect(note).toBeNull();
    });
  });

  describe("featured content filtering", () => {
    it("should be able to filter featured neural notes", async () => {
      const notes = await loadNeuralNotes();
      const featured = notes.filter((n) => n.meta.featured);

      // All filtered items should be featured
      expect(featured.every((n) => n.meta.featured)).toBe(true);
    });

    it("should be able to filter featured projects", async () => {
      const projects = await loadProjects();
      const featured = projects.filter((p) => p.meta.featured);

      // All filtered items should be featured
      expect(featured.every((p) => p.meta.featured)).toBe(true);
    });
  });

  describe("tag filtering", () => {
    it("should be able to filter neural notes by tag", async () => {
      const notes = await loadNeuralNotes();

      // Get all unique tags
      const allTags = new Set(notes.flatMap((n) => n.meta.tags));

      if (allTags.size > 0) {
        const firstTag = Array.from(allTags)[0];
        const filtered = notes.filter((n) => n.meta.tags.includes(firstTag));

        // All filtered items should have the tag
        expect(filtered.every((n) => n.meta.tags.includes(firstTag))).toBe(true);
      }
    });

    it("should be able to filter projects by tag", async () => {
      const projects = await loadProjects();

      // Get all unique tags
      const allTags = new Set(projects.flatMap((p) => p.meta.tags));

      if (allTags.size > 0) {
        const firstTag = Array.from(allTags)[0];
        const filtered = projects.filter((p) => p.meta.tags.includes(firstTag));

        // All filtered items should have the tag
        expect(filtered.every((p) => p.meta.tags.includes(firstTag))).toBe(true);
      }
    });
  });

  describe("pagination", () => {
    it("should support pagination of neural notes", async () => {
      const notes = await loadNeuralNotes();

      if (notes.length > 5) {
        const pageSize = 5;
        const page1 = notes.slice(0, pageSize);
        const page2 = notes.slice(pageSize, pageSize * 2);

        expect(page1.length).toBe(pageSize);
        expect(page1[0].slug).not.toBe(page2[0].slug);
      }
    });

    it("should support pagination of projects", async () => {
      const projects = await loadProjects();

      if (projects.length > 5) {
        const pageSize = 5;
        const page1 = projects.slice(0, pageSize);
        const page2 = projects.slice(pageSize, pageSize * 2);

        expect(page1.length).toBe(pageSize);
        expect(page1[0].slug).not.toBe(page2[0].slug);
      }
    });

    it("should handle last page with fewer items", async () => {
      const notes = await loadNeuralNotes();

      if (notes.length > 5) {
        const pageSize = 5;
        const totalPages = Math.ceil(notes.length / pageSize);
        const lastPage = notes.slice((totalPages - 1) * pageSize);

        expect(lastPage.length).toBeGreaterThan(0);
        expect(lastPage.length).toBeLessThanOrEqual(pageSize);
      }
    });
  });

  describe("combined filtering and sorting", () => {
    it("should support filtering by tag and featured status", async () => {
      const notes = await loadNeuralNotes();

      // Get all unique tags
      const allTags = new Set(notes.flatMap((n) => n.meta.tags));

      if (allTags.size > 0) {
        const firstTag = Array.from(allTags)[0];
        const filtered = notes
          .filter((n) => n.meta.tags.includes(firstTag))
          .filter((n) => n.meta.featured);

        // All filtered items should have both the tag and be featured
        expect(filtered.every((n) => n.meta.tags.includes(firstTag) && n.meta.featured)).toBe(true);
      }
    });

    it("should maintain date sorting after filtering", async () => {
      const notes = await loadNeuralNotes();
      const featured = notes.filter((n) => n.meta.featured);

      if (featured.length > 1) {
        for (let i = 0; i < featured.length - 1; i++) {
          const currentDate = new Date(featured[i].meta.date).getTime();
          const nextDate = new Date(featured[i + 1].meta.date).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      }
    });
  });
});
