import yaml from "js-yaml";
import type React from "react";
import {
  computeReadingTimeFromRawOrComponent,
  readingTimeFromText,
  stripFrontMatter,
} from "./readingTime";

// MDX module types
interface MdxModuleWithFrontmatter<TMeta> {
  default: React.ComponentType;
  frontmatter?: Partial<TMeta>;
}

type RawLoader = () => Promise<string>;

const parseFrontmatterYaml = <TMeta extends object>(raw: string | undefined): Partial<TMeta> => {
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
  draft?: boolean;
  editorTodos?: string[];
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
  draft?: boolean;
  editorTodos?: string[];
}

export interface ContentItem<T = NeuralNoteMetaWithCalculated | ProjectMeta> {
  slug: string;
  meta: T;
  content: React.ComponentType; // MDX component instead of raw string
}

// ------------------------------------------------------------
// Synchronous caches for instant render on list/detail pages
// ------------------------------------------------------------
// Build once at module init from eager MDX modules. Avoid async config loads.
const noteModulesSync = import.meta.glob("/content/neural-notes/*.mdx", { eager: true }) as Record<
  string,
  MdxModuleWithFrontmatter<NeuralNoteMeta>
>;

const NOTES_SYNC: ContentItem<NeuralNoteMetaWithCalculated>[] = Object.entries(noteModulesSync)
  .map(([path, mdxModule]) => {
    const MDXContent = mdxModule.default;
    const slug = path.split("/").pop()?.replace(".mdx", "") || "";
    const fm = (mdxModule.frontmatter ?? {}) as Partial<NeuralNoteMeta>;

    const rawTags: unknown = (fm as unknown as { tags?: unknown }).tags;
    const normalizedTags: string[] = Array.isArray(rawTags)
      ? (rawTags as unknown[]).map((t) => String(t)).filter(Boolean)
      : typeof rawTags === "string" && rawTags.trim().length > 0
        ? [rawTags.trim()]
        : [];
    const rawEditorTodos: unknown = (fm as unknown as { editorTodos?: unknown }).editorTodos;
    const normalizedEditorTodos: string[] = Array.isArray(rawEditorTodos)
      ? (rawEditorTodos as unknown[]).map((t) => String(t)).filter(Boolean)
      : typeof rawEditorTodos === "string" && rawEditorTodos.trim().length > 0
        ? [rawEditorTodos.trim()]
        : [];

    const normalizedMeta: NeuralNoteMetaWithCalculated = {
      title: fm.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
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
      draft: Boolean((fm as unknown as { draft?: unknown }).draft),
      editorTodos: normalizedEditorTodos,
      // Synchronous approximation using excerpt; precise calculation is done when needed via async helpers
      readTime: readingTimeFromText(fm.excerpt ?? ""),
    };

    return {
      slug,
      meta: normalizedMeta,
      content: MDXContent,
    };
  })
  // Exclude drafts and sort by date (newest first)
  .filter((p) => !p.meta.draft)
  .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

export function getNeuralNotesSync(): ContentItem<NeuralNoteMetaWithCalculated>[] {
  return NOTES_SYNC;
}

export function getNeuralNoteBySlugSync(
  slug: string,
): ContentItem<NeuralNoteMetaWithCalculated> | null {
  return NOTES_SYNC.find((n) => n.slug === slug) ?? null;
}

// Load Neural Notes from MDX files
export async function loadNeuralNotes(): Promise<ContentItem<NeuralNoteMetaWithCalculated>[]> {
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
        const rawEditorTodos: unknown = (fm as unknown as { editorTodos?: unknown }).editorTodos;
        const normalizedEditorTodos: string[] = Array.isArray(rawEditorTodos)
          ? (rawEditorTodos as unknown[]).map((t) => String(t)).filter(Boolean)
          : typeof rawEditorTodos === "string" && rawEditorTodos.trim().length > 0
            ? [rawEditorTodos.trim()]
            : [];

        const normalizedMeta: NeuralNoteMetaWithCalculated = {
          title: fm.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
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
          draft: Boolean((fm as unknown as { draft?: unknown }).draft),
          editorTodos: normalizedEditorTodos,
          readTime: configuredReadTime,
        };

        return {
          slug,
          meta: normalizedMeta,
          content: MDXContent,
        };
      }),
    );

    // Exclude drafts and sort by date (newest first)
    return posts
      .filter((p) => !p.meta.draft)
      .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
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

        const fm = (meta ?? {}) as Partial<ProjectMeta>;
        const rawTags: unknown = (fm as unknown as { tags?: unknown }).tags;
        const normalizedTags: string[] = Array.isArray(rawTags)
          ? (rawTags as unknown[]).map((t) => String(t)).filter(Boolean)
          : typeof rawTags === "string" && rawTags.trim().length > 0
            ? [rawTags.trim()]
            : [];
        const rawEditorTodos: unknown = (fm as unknown as { editorTodos?: unknown }).editorTodos;
        const normalizedEditorTodos: string[] = Array.isArray(rawEditorTodos)
          ? (rawEditorTodos as unknown[]).map((t) => String(t)).filter(Boolean)
          : typeof rawEditorTodos === "string" && rawEditorTodos.trim().length > 0
            ? [rawEditorTodos.trim()]
            : [];

        const normalizedMeta: ProjectMeta = {
          title: fm.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          description: fm.description ?? "",
          date: fm.date ?? "2024-01-01",
          tags: normalizedTags,
          github: fm.github,
          demo: fm.demo,
          featured: Boolean(fm.featured),
          image: fm.image,
          draft: Boolean((fm as unknown as { draft?: unknown }).draft),
          editorTodos: normalizedEditorTodos,
        };

        return {
          slug,
          meta: normalizedMeta,
          content: MDXContent,
        };
      }),
    );

    // Exclude drafts and sort by date (newest first)
    return projects
      .filter((p) => !p.meta.draft)
      .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
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
export async function getProjectBySlug(slug: string): Promise<ContentItem<ProjectMeta> | null> {
  try {
    const projects = await loadProjects();
    return projects.find((project) => project.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}

// Re-export the config-based functions for backward compatibility
export { calculateReadingTime, formatDate, getNeuralNoteOgImage } from "./config";
