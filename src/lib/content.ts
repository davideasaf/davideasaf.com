import yaml from "js-yaml";
import type React from "react";
import { computeReadingTimeFromRawOrComponent, stripFrontMatter } from "./readingTime";

// MDX module types
interface MdxModuleWithFrontmatter<TMeta> {
  default: React.ComponentType;
  frontmatter?: Partial<TMeta>;
}

type RawLoader = () => Promise<string>;

const parseFrontmatterYaml = <TMeta extends object>(
  raw: string | undefined,
): Partial<TMeta> => {
  if (!raw) return {};
  const match = raw.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) return {};
  try {
    return (yaml.load(match[1]) as Partial<TMeta>) ?? {};
  } catch {
    return {};
  }
};

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
    // Import MDX components (eager for routing/build-time awareness)
    const modules = import.meta.glob("/content/neural-notes/*.mdx", {
      eager: true,
    });
    // Prepare lazy raw loaders only for fallback scenarios (no eager double-load)
    const rawLoaders = import.meta.glob("/content/neural-notes/*.mdx", {
      query: "?raw",
      import: "default",
    }) as Record<string, RawLoader>;

    const posts = await Promise.all(
      Object.entries(modules).map(async ([path, moduleExports]) => {
        const mdxModule = moduleExports as MdxModuleWithFrontmatter<NeuralNoteMeta>;
        const MDXContent = mdxModule.default;

        // Extract slug from filename
        const slug = path.split("/").pop()?.replace(".mdx", "") || "";

        // Prefer MDX-exported frontmatter; fall back to YAML block in the raw file (lazy-loaded)
        let rawContent: string | undefined;
        let fmAttrs: Partial<NeuralNoteMeta> | undefined = mdxModule.frontmatter;
        if (!fmAttrs) {
          const loader = rawLoaders[path];
          if (typeof loader === "function") {
            try {
              rawContent = await loader();
              fmAttrs = parseFrontmatterYaml<NeuralNoteMeta>(rawContent);
            } catch {
              // ignore and continue without raw fallback
            }
          }
        }

        const configuredReadTime = await computeReadingTimeFromRawOrComponent(
          rawContent ? stripFrontMatter(rawContent) : undefined,
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
    // Import MDX components (eager)
    const modules = import.meta.glob("/content/projects/*.mdx", {
      eager: true,
    });
    // Lazy raw loaders only for fallback
    const rawLoaders = import.meta.glob("/content/projects/*.mdx", {
      query: "?raw",
      import: "default",
    }) as Record<string, RawLoader>;

    const projects = await Promise.all(
      Object.entries(modules).map(async ([path, moduleExports]) => {
        const mdxModule = moduleExports as MdxModuleWithFrontmatter<ProjectMeta>;
        const MDXContent = mdxModule.default;

        // Determine frontmatter (prefer module export)
        let meta: Partial<ProjectMeta> | undefined = mdxModule.frontmatter;
        if (!meta) {
          const loader = rawLoaders[path];
          if (typeof loader === "function") {
            try {
              const raw = await loader();
              meta = parseFrontmatterYaml<ProjectMeta>(raw);
            } catch {
              // ignore
            }
          }
        }

        // Extract slug from filename
        const slug = path.split("/").pop()?.replace(".mdx", "") || "";

        return {
          slug,
          meta: (meta ?? {}) as ProjectMeta,
          content: MDXContent,
        };
      }),
    );

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
