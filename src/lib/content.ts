import yaml from "js-yaml";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { readingTimeFromText } from "./readingTime";

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
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to parse frontmatter YAML:", error);
    }
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
  audioTitle?: string;
  banner?: string; // Banner image URL/path
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
  banner?: string; // Banner image URL/path (higher priority than image)
  videoUrl?: string; // Video URL for projects
  videoTitle?: string; // Video title for projects
  audioUrl?: string;
  audioTitle?: string;
  status?: string;
  keyFeatures?: string[];
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

// Simple approach: render the MDX component to get word count
// This is synchronous and works reliably
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

    // Calculate reading time from rendered component
    // This is the most reliable way - we render the component and count words
    let readTime = "1 min read";
    try {
      const html = ReactDOMServer.renderToStaticMarkup(React.createElement(MDXContent));
      // Strip HTML and count words
      const text = html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      readTime = readingTimeFromText(text);
    } catch (_error) {
      // Fallback to excerpt-based estimation
      readTime = readingTimeFromText(fm.excerpt ?? "");
    }

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
      audioTitle: fm.audioTitle,
      banner: fm.banner,
      draft: Boolean((fm as unknown as { draft?: unknown }).draft),
      editorTodos: normalizedEditorTodos,
      readTime,
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
// Simply returns the pre-calculated sync data wrapped in a Promise for backward compatibility
export async function loadNeuralNotes(): Promise<ContentItem<NeuralNoteMetaWithCalculated>[]> {
  return Promise.resolve(NOTES_SYNC);
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
            } catch (error) {
              if (import.meta.env.DEV) {
                console.error(`Failed to load raw content for ${path}:`, error);
              }
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
        const rawKeyFeatures: unknown = (fm as unknown as { keyFeatures?: unknown }).keyFeatures;
        const normalizedKeyFeatures: string[] = Array.isArray(rawKeyFeatures)
          ? (rawKeyFeatures as unknown[]).map((t) => String(t)).filter(Boolean)
          : typeof rawKeyFeatures === "string" && rawKeyFeatures.trim().length > 0
            ? [rawKeyFeatures.trim()]
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
          banner: fm.banner,
          videoUrl: fm.videoUrl,
          videoTitle: fm.videoTitle,
          status: typeof fm.status === "string" ? fm.status : undefined,
          keyFeatures: normalizedKeyFeatures,
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
// Simply returns the pre-calculated sync data wrapped in a Promise for backward compatibility
export async function getNeuralNoteBySlug(
  slug: string,
): Promise<ContentItem<NeuralNoteMetaWithCalculated> | null> {
  return Promise.resolve(getNeuralNoteBySlugSync(slug));
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

// Helper function to get the primary media for display (Video > Audio > Banner > Image)
export function getPrimaryMedia(meta: NeuralNoteMetaWithCalculated | ProjectMeta): {
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
  if ("image" in meta && meta.image) {
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

// Re-export the config-based functions for backward compatibility
export { calculateReadingTime, formatDate, getNeuralNoteOgImage } from "./config";
