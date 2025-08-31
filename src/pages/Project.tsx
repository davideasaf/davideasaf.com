import { ArrowLeft, Calendar, ExternalLink, Github, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_EVENTS, captureEvent } from "@/lib/analytics";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  date: string;
  status: string;
  keyFeatures: string[];
}

const projects: ProjectData[] = [
  {
    id: "neural-content-generator",
    title: "Neural Content Generator",
    description:
      "An advanced AI-powered content generation system that leverages transformer models to create high-quality, contextually relevant content across multiple domains.",
    longDescription:
      "This project represents a breakthrough in automated content creation, utilizing state-of-the-art language models to generate compelling, coherent, and contextually appropriate content. The system incorporates advanced prompt engineering techniques, fine-tuning methodologies, and multi-modal capabilities to deliver professional-grade content at scale.",
    tags: ["Python", "Transformers", "OpenAI", "FastAPI", "React"],
    github: "https://github.com/davideasaf/neural-content-generator",
    demo: "https://neural-content-demo.vercel.app",
    featured: true,
    date: "2024-01",
    status: "Active Development",
    keyFeatures: [
      "Multi-domain content generation",
      "Context-aware prompt engineering",
      "Real-time content optimization",
      "API-first architecture",
      "Scalable deployment pipeline",
    ],
  },
  {
    id: "agentic-workflow-orchestrator",
    title: "Agentic Workflow Orchestrator",
    description:
      "A sophisticated orchestration platform for managing complex AI agent workflows with real-time monitoring and adaptive task distribution.",
    longDescription:
      "Built to address the challenges of coordinating multiple AI agents in enterprise environments, this orchestrator provides intelligent task distribution, conflict resolution, and performance optimization across agent networks.",
    tags: ["TypeScript", "Node.js", "Docker", "Kubernetes", "Redis"],
    github: "https://github.com/davideasaf/agentic-orchestrator",
    featured: true,
    date: "2024-02",
    status: "Beta",
    keyFeatures: [
      "Intelligent agent coordination",
      "Real-time performance monitoring",
      "Scalable architecture",
      "Conflict resolution algorithms",
      "Enterprise-grade security",
    ],
  },
  {
    id: "llm-fine-tuning-toolkit",
    title: "LLM Fine-tuning Toolkit",
    description:
      "A comprehensive toolkit for fine-tuning large language models with efficient training pipelines and evaluation frameworks.",
    longDescription:
      "This toolkit simplifies the complex process of fine-tuning LLMs for domain-specific applications, providing optimized training strategies, evaluation metrics, and deployment utilities.",
    tags: ["Python", "PyTorch", "Hugging Face", "CUDA", "MLOps"],
    github: "https://github.com/davideasaf/llm-fine-tuning",
    date: "2023-11",
    status: "Stable",
    keyFeatures: [
      "Efficient training pipelines",
      "Comprehensive evaluation suite",
      "Memory optimization techniques",
      "Multi-GPU support",
      "Automated hyperparameter tuning",
    ],
  },
  {
    id: "intelligent-code-reviewer",
    title: "Intelligent Code Reviewer",
    description:
      "An AI-powered code review system that provides contextual feedback, security analysis, and performance optimization suggestions.",
    longDescription:
      "Leveraging advanced static analysis and machine learning techniques, this system provides intelligent code review capabilities that go beyond traditional linting to offer architectural insights and optimization recommendations.",
    tags: ["Python", "JavaScript", "AST", "Machine Learning", "CI/CD"],
    github: "https://github.com/davideasaf/intelligent-reviewer",
    date: "2023-09",
    status: "Maintenance",
    keyFeatures: [
      "Context-aware code analysis",
      "Security vulnerability detection",
      "Performance optimization hints",
      "Multi-language support",
      "CI/CD integration",
    ],
  },
];

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, _setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const foundProject = projects.find((p) => p.id === id) || null;
    if (!foundProject) {
      setError("Project not found");
      setProject(null);
    } else {
      setError(null);
      setProject(foundProject);
    }
  }, [id]);

  useEffect(() => {
    if (project) {
      captureEvent(ANALYTICS_EVENTS.PROJECT_DETAIL_VIEWED, { project_id: project.id });
    }
  }, [project]);

  // no loading state — render immediately or show error

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-destructive">Error</h1>
              <p className="text-muted-foreground">{error || "Project not found"}</p>
              <Button asChild>
                <Link to="/projects">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{project.title} - David Asaf's AI Project</title>
        <meta name="description" content={project.longDescription} />
        <meta property="og:title" content={`${project.title} - David Asaf's AI Project`} />
        <meta property="og:description" content={project.longDescription} />
        <link rel="canonical" href={`https://davidasaf.com/projects/${id}`} />
      </Helmet>
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Projects", href: "/projects" },
              { label: project?.title || "Loading..." },
            ]}
          />
          <Button variant="ghost" className="mb-8" asChild>
            <Link to="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                <Badge variant={project.status === "Active Development" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {project.date}
                </div>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {project.longDescription}
              </p>

              <div className="flex gap-4">
                {project.github && (
                  <Button
                    asChild
                    onClick={() =>
                      captureEvent(ANALYTICS_EVENTS.PROJECT_DETAIL_EXTERNAL_CLICKED, {
                        project_id: project.id,
                        target: "github",
                      })
                    }
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
                )}
                {project.demo && (
                  <Button
                    variant="outline"
                    asChild
                    onClick={() =>
                      captureEvent(ANALYTICS_EVENTS.PROJECT_DETAIL_EXTERNAL_CLICKED, {
                        project_id: project.id,
                        target: "demo",
                      })
                    }
                  >
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.keyFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
