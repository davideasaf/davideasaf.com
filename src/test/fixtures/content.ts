import type { ContentItem, NeuralNoteMetaWithCalculated, ProjectMeta } from "@/lib/content";

// Mock React component for content
const MockContent = () => null;

export const mockProjects: ContentItem<ProjectMeta>[] = [
  {
    slug: "ai-chatbot",
    meta: {
      title: "AI Chatbot Platform",
      description: "An intelligent chatbot powered by machine learning",
      date: "2024-01-15",
      tags: ["AI", "Machine Learning", "NLP", "React"],
      github: "https://github.com/user/ai-chatbot",
      demo: "https://demo.example.com/ai-chatbot",
      featured: true,
      banner: "/images/ai-chatbot.jpg",
      status: "Active",
    },
    content: MockContent,
  },
  {
    slug: "data-viz-tool",
    meta: {
      title: "Data Visualization Tool",
      description: "Interactive data visualization dashboard",
      date: "2024-02-20",
      tags: ["Data Science", "D3.js", "TypeScript"],
      github: "https://github.com/user/data-viz",
      featured: false,
      image: "/images/data-viz.jpg",
    },
    content: MockContent,
  },
  {
    slug: "minimal-project",
    meta: {
      title: "Minimal Project",
      description: "A project with minimal metadata",
      date: "2024-03-10",
      tags: ["JavaScript"],
      featured: false,
    },
    content: MockContent,
  },
];

export const mockNeuralNotes: ContentItem<NeuralNoteMetaWithCalculated>[] = [
  {
    slug: "understanding-transformers",
    meta: {
      title: "Understanding Transformers in AI",
      excerpt: "A deep dive into the transformer architecture",
      date: "2024-01-10",
      author: "David Asaf",
      tags: ["AI", "Deep Learning", "Transformers"],
      featured: true,
      hasVideo: true,
      hasAudio: false,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoTitle: "Transformer Architecture Explained",
      banner: "/images/transformers.jpg",
      readTime: "8 min read",
    },
    content: MockContent,
  },
  {
    slug: "react-best-practices",
    meta: {
      title: "React Best Practices 2024",
      excerpt: "Modern patterns and practices for React development",
      date: "2024-02-15",
      author: "David Asaf",
      tags: ["React", "JavaScript", "Best Practices"],
      featured: false,
      hasVideo: false,
      hasAudio: true,
      audioUrl: "/audio/react-best-practices.mp3",
      audioTitle: "React Best Practices Audio",
      readTime: "5 min read",
    },
    content: MockContent,
  },
  {
    slug: "minimal-note",
    meta: {
      title: "Minimal Note",
      excerpt: "A note with minimal metadata",
      date: "2024-03-01",
      author: "David Asaf",
      tags: ["Testing"],
      featured: false,
      hasVideo: false,
      hasAudio: false,
      readTime: "2 min read",
    },
    content: MockContent,
  },
];
