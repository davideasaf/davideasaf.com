// Content management utilities for Git-based markdown content

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

export interface NeuralNoteMeta {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  videoUrl?: string;
  audioUrl?: string;
  videoTitle?: string;
}

export interface ContentItem {
  slug: string;
  meta: ProjectMeta | NeuralNoteMeta;
  content: string;
}

// Mock data for demonstration - in a real implementation, this would
// parse markdown files from the content directory
export const getProjects = (): ContentItem[] => {
  return [
    {
      slug: "neural-content-generator",
      meta: {
        title: "Neural Content Generator",
        description: "Advanced GPT-powered content generation platform with custom training capabilities and multi-modal output support.",
        date: "2024-01-20",
        tags: ["GPT-4", "Python", "React", "FastAPI"],
        github: "https://github.com/yourusername/neural-content-generator", 
        demo: "https://neural-generator.demo.com",
        featured: true,
        image: "/projects/neural-generator.jpg"
      },
      content: "" // Would contain the parsed markdown content
    }
  ];
};

export const getNeuralNotes = (): ContentItem[] => {
  return [
    {
      slug: "future-of-llms",
      meta: {
        title: "The Future of Large Language Models: Beyond GPT-4",
        excerpt: "Exploring the next generation of AI models and their potential impact on software development, creativity, and human-computer interaction.",
        date: "2024-01-15",
        author: "Your Name",
        tags: ["LLM", "GPT-4", "AI Research"],
        readTime: "8 min read",
        featured: true,
        hasVideo: true,
        hasAudio: false,
        videoUrl: "https://youtube.com/embed/dQw4w9WgXcQ",
        videoTitle: "The Future of LLMs - Deep Dive Discussion"
      },
      content: "" // Would contain the parsed markdown content
    }
  ];
};

// Utility function to parse frontmatter from markdown
export const parseFrontmatter = (content: string) => {
  const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n/s;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { meta: {}, content };
  }

  const frontmatter = match[1];
  const markdownContent = content.slice(match[0].length);
  
  // Simple YAML parser for demo - in production, use a proper YAML library
  const meta: Record<string, any> = {};
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      meta[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  });

  return { meta, content: markdownContent };
};

// Git-based deployment strategy recommendations:
/*
1. Content Structure:
   - /content/projects/*.md - Project case studies
   - /content/neural-notes/*.md - Blog posts
   - /content/config.yaml - Site configuration

2. Git Workflow:
   - main branch: Production content
   - draft branches: Work-in-progress content
   - Tags: Version releases (v1.0, v1.1, etc.)

3. Automated Deployment:
   - GitHub Actions to build and deploy on push to main
   - Preview deployments for pull requests
   - Content validation and linting in CI/CD

4. Content Management:
   - Use conventional commits for content changes
   - Leverage GitHub's web editor for quick updates
   - Tag releases for major content updates
*/