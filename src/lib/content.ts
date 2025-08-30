import frontMatter from "front-matter";
import yaml from "js-yaml";
import type React from "react";
import { computeReadingTimeFromRawOrComponent } from "./readingTime";

// Type definitions for content
export interface NeuralNoteMeta {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  featured: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  videoUrl?: string;
  audioUrl?: string;
  videoTitle?: string;
}

// Extended interface that includes calculated fields
export interface NeuralNoteMetaWithCalculated extends NeuralNoteMeta {
  readTime: string;
}

export interface ProjectMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  image?: string;
}

export interface ContentItem<T = NeuralNoteMetaWithCalculated | ProjectMeta> {
  slug: string;
  meta: T;
  content: React.ComponentType; // MDX component instead of raw string
}

// Load Neural Notes from MDX files
export async function loadNeuralNotes(): Promise<
  ContentItem<NeuralNoteMetaWithCalculated>[]
> {
  try {
    // Import MDX components and raw content for frontmatter extraction
    const modules = import.meta.glob("/content/neural-notes/*.mdx", {
      eager: true,
    });
    // Load raw strings for MDX files (handle both raw strings and loaders)
    const rawModules = import.meta.glob("/content/neural-notes/*.mdx", {
      eager: true,
      as: "raw",
    });
    const resolveRawContent = async (
      entry: unknown,
    ): Promise<string | undefined> => {
      if (typeof entry === "string") return entry as string;
      if (entry && typeof (entry as any).default === "string")
        return (entry as any).default as string;
      if (typeof entry === "function") {
        try {
          const res: unknown = await (entry as () => Promise<unknown>)();
          if (typeof res === "string") return res as string;
          if (res && typeof (res as any).default === "string")
            return (res as any).default as string;
        } catch { }
      }
      return undefined;
    };

    // Helpers to work with frontmatter without third-party parsing issues
    const stripFrontMatter = (raw: string | undefined): string => {
      if (!raw) return "";
      return raw.replace(/^---[\s\S]*?---\s*/, "");
    };
    const parseFrontmatterYaml = (
      raw: string | undefined,
    ): Partial<NeuralNoteMeta> => {
      if (!raw) return {};
      const match = raw.match(/^---\s*([\s\S]*?)\s*---/);
      if (!match) return {};
      try {
        return (yaml.load(match[1]) as Partial<NeuralNoteMeta>) ?? {};
      } catch {
        return {};
      }
    };

    const posts = await Promise.all(
      Object.entries(modules).map(async ([path, moduleExports]) => {
        const mdxModule = moduleExports as {
          default: React.ComponentType;
          frontmatter?: Partial<NeuralNoteMeta>;
        };
        const MDXContent = mdxModule.default;

        // Extract slug from filename
        const slug = path.split("/").pop()?.replace(".mdx", "") || "";

        // Prefer MDX-exported frontmatter; fall back to YAML block in the raw file
        const rawMaybe = (rawModules as Record<string, unknown>)[path];
        const rawContent = await resolveRawContent(rawMaybe);
        if (typeof window !== "undefined") {
          try {
            console.debug(
              "[reading-time] rawMaybe typeof",
              typeof rawMaybe,
              "hasDefault",
              Boolean((rawMaybe as any)?.default),
              "rawContentLen",
              typeof rawContent === "string" ? rawContent.length : "n/a",
            );
          } catch { }
        }
        const fmAttrs =
          (mdxModule as any).frontmatter ??
          (typeof rawContent === "string"
            ? parseFrontmatterYaml(rawContent)
            : {});
        const configuredReadTime = await computeReadingTimeFromRawOrComponent(
          typeof rawContent === "string" ? rawContent : undefined,
          MDXContent,
        );

        const fm = (fmAttrs ?? {}) as Partial<NeuralNoteMeta>;
        const rawTags: unknown = (fm as unknown as { tags?: unknown }).tags;
        const normalizedTags: string[] = Array.isArray(rawTags)
          ? (rawTags as unknown[]).map((t) => String(t)).filter(Boolean)
          : typeof rawTags === "string" && rawTags.trim().length > 0
            ? [rawTags.trim()]
            : [];

        const normalizedMeta: NeuralNoteMetaWithCalculated = {
          title:
            fm.title ??
            slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          excerpt: fm.excerpt ?? "",
          date: fm.date ?? "2024-01-01",
          author: fm.author ?? "David Asaf",
          tags: normalizedTags,
          featured: Boolean(fm.featured),
          hasVideo: Boolean(fm.hasVideo) || typeof fm.videoUrl === "string",
          hasAudio: Boolean(fm.hasAudio) || typeof fm.audioUrl === "string",
          videoUrl: fm.videoUrl,
          audioUrl: fm.audioUrl,
          videoTitle: fm.videoTitle,
          readTime: configuredReadTime,
        };

        return {
          slug,
          meta: normalizedMeta,
          content: MDXContent,
        };
      }),
    );

    // Sort by date (newest first)
    return posts.sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
    );
  } catch (error) {
    console.error("Error loading neural notes:", error);
    return [];
  }
}

// Load Projects from MDX files
export async function loadProjects(): Promise<ContentItem<ProjectMeta>[]> {
  try {
    // Import MDX components
    const modules = import.meta.glob("/content/projects/*.mdx", {
      eager: true,
    });

    // Import raw content for frontmatter extraction
    const rawModules = import.meta.glob("/content/projects/*.mdx", {
      eager: true,
      as: "raw",
    });

    const projects = Object.entries(modules).map(([path, moduleExports]) => {
      // Get the MDX component
      const mdxModule = moduleExports as any;
      const MDXContent = mdxModule.default;

      // Get raw content and extract frontmatter
      const rawMaybe = rawModules[path] as unknown;
      const rawContent =
        typeof rawMaybe === "string"
          ? rawMaybe
          : rawMaybe && typeof (rawMaybe as any).default === "string"
            ? (rawMaybe as any).default
            : "";
      const { attributes: frontmatter } = frontMatter(rawContent);

      // Extract slug from filename
      const slug = path.split("/").pop()?.replace(".mdx", "") || "";

      return {
        slug,
        meta: frontmatter as ProjectMeta,
        content: MDXContent, // This is now a React component
      };
    });

    // Sort by date (newest first)
    return projects.sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
    );
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

// Get a specific neural note by slug
export async function getNeuralNoteBySlug(
  slug: string,
): Promise<ContentItem<NeuralNoteMetaWithCalculated> | null> {
  try {
    const posts = await loadNeuralNotes();
    return posts.find((post) => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading neural note ${slug}:`, error);
    return null;
  }
}

// Get a specific project by slug
export async function getProjectBySlug(
  slug: string,
): Promise<ContentItem<ProjectMeta> | null> {
  try {
    const projects = await loadProjects();
    return projects.find((project) => project.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}

// Re-export the config-based functions for backward compatibility
export { calculateReadingTime, formatDate } from "./config";
