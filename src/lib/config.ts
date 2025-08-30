import yaml from "js-yaml";

// Type definitions for site configuration
export interface SiteConfig {
  site: {
    title: string;
    email: string;
    location: string;
    social: {
      github: string;
      linkedin: string;
    };
  };
  content: {
    reading: {
      wordsPerMinute: number;
      includeCodeInWordCount: boolean;
    };
    images: {
      quality: number;
      defaultWidth: number;
      formats: string[];
    };
  };
  neuralNotes: {
    defaultAuthor: string;
    sortBy: "date" | "title" | "readTime";
    sortOrder: "asc" | "desc";
  };
  projects: {
    sortBy: "date" | "title" | "featured";
    sortOrder: "asc" | "desc";
  };
}

// Load and parse configuration from YAML file
let config: SiteConfig | null = null;

export async function loadConfig(): Promise<SiteConfig> {
  if (config) return config;

  try {
    // Import the YAML file as raw text
    const configModule = await import("@/config/site.yaml?raw");
    const yamlContent = configModule.default;

    // Parse YAML content
    const parsedConfig = yaml.load(yamlContent) as SiteConfig;
    config = parsedConfig;

    return config;
  } catch (error) {
    console.error("Failed to load site configuration:", error);

    // Return sensible defaults if config loading fails
    const defaultConfig: SiteConfig = {
      site: {
        title: "David Asaf - AI Product Engineer",
        email: "david@davidasaf.dev",
        location: "Charlotte, NC",
        social: {
          github: "https://github.com/davideasaf",
          linkedin: "https://www.linkedin.com/in/davideasaf/",
        },
      },
      content: {
        reading: {
          wordsPerMinute: 200,
          includeCodeInWordCount: false,
        },
        images: {
          quality: 80,
          defaultWidth: 800,
          formats: ["webp"],
        },
      },
      neuralNotes: {
        defaultAuthor: "David Asaf",
        sortBy: "date",
        sortOrder: "desc",
      },
      projects: {
        sortBy: "date",
        sortOrder: "desc",
      },
    };

    config = defaultConfig;
    return config;
  }
}

// Helper function to get config synchronously (must be called after loadConfig)
export function getConfig(): SiteConfig {
  if (!config) {
    throw new Error("Configuration not loaded. Call loadConfig() first.");
  }
  return config;
}

// Utility function to calculate reading time using config
export async function calculateReadingTime(content: string): Promise<string> {
  const config = await loadConfig();
  const { wordsPerMinute, includeCodeInWordCount } = config.content.reading;

  let text = content;

  // Remove code blocks if configured to exclude them
  if (!includeCodeInWordCount) {
    // Remove code blocks (both ``` and ` style)
    text = text.replace(/```[\s\S]*?```/g, "");
    text = text.replace(/`[^`]+`/g, "");
  }

  // Remove markdown syntax for more accurate word count
  text = text
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
    .replace(/\*([^*]+)\*/g, "$1") // Remove italics
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // Remove images
    .replace(/---+/g, "") // Remove horizontal rules
    .replace(/>\s/g, "") // Remove blockquotes
    .replace(/^\s*[-*+]\s/gm, "") // Remove list markers
    .replace(/^\s*\d+\.\s/gm, ""); // Remove numbered list markers

  // Remove HTML tags if HTML was provided as a fallback source
  text = text.replace(/<[^>]+>/g, " ");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ");

  // Count words
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const safeWpm =
    Number.isFinite(wordsPerMinute) && wordsPerMinute > 0
      ? wordsPerMinute
      : 200;
  const rawMinutes = wordCount > 0 ? wordCount / safeWpm : 1;
  const minutes = Math.max(1, Math.ceil(rawMinutes));

  return `${minutes} min read`;
}

// Utility function to format date (keeping existing functionality)
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
