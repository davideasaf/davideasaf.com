import frontMatter from 'front-matter';

// Type definitions for content
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

export interface ContentItem<T = NeuralNoteMeta | ProjectMeta> {
  slug: string;
  meta: T;
  content: string;
}

// Load Neural Notes from markdown files
export async function loadNeuralNotes(): Promise<ContentItem<NeuralNoteMeta>[]> {
  try {
    // Import all markdown files from content/neural-notes
    const modules = import.meta.glob('/content/neural-notes/*.md', { 
      eager: true,
      query: '?raw',
      import: 'default'
    });

    const posts = Object.entries(modules).map(([path, content]) => {
      // Parse frontmatter and content
      const parsed = frontMatter(content as string);
      const data = parsed.attributes;
      const markdown = parsed.body;
      
      // Extract slug from filename
      const slug = path.split('/').pop()?.replace('.md', '') || '';

      return {
        slug,
        meta: data as NeuralNoteMeta,
        content: markdown
      };
    });

    // Sort by date (newest first)
    return posts.sort((a, b) => 
      new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    );
  } catch (error) {
    console.error('Error loading neural notes:', error);
    return [];
  }
}

// Load Projects from markdown files
export async function loadProjects(): Promise<ContentItem<ProjectMeta>[]> {
  try {
    // Import all markdown files from content/projects
    const modules = import.meta.glob('/content/projects/*.md', { 
      eager: true,
      query: '?raw',
      import: 'default'
    });

    const projects = Object.entries(modules).map(([path, content]) => {
      // Parse frontmatter and content
      const parsed = frontMatter(content as string);
      const data = parsed.attributes;
      const markdown = parsed.body;
      
      // Extract slug from filename
      const slug = path.split('/').pop()?.replace('.md', '') || '';

      return {
        slug,
        meta: data as ProjectMeta,
        content: markdown
      };
    });

    // Sort by date (newest first)
    return projects.sort((a, b) => 
      new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    );
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// Get a specific neural note by slug
export async function getNeuralNoteBySlug(slug: string): Promise<ContentItem<NeuralNoteMeta> | null> {
  try {
    const posts = await loadNeuralNotes();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading neural note ${slug}:`, error);
    return null;
  }
}

// Get a specific project by slug
export async function getProjectBySlug(slug: string): Promise<ContentItem<ProjectMeta> | null> {
  try {
    const projects = await loadProjects();
    return projects.find(project => project.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}

// Utility function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Utility function to calculate reading time
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}