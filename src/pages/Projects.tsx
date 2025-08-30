import { useState } from "react";
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

const projects = [
  {
    id: "neural-content-generator",
    title: "Neural Content Generator",
    description: "An advanced AI-powered content generation system that leverages transformer models to create high-quality, contextually relevant content across multiple domains.",
    longDescription: "This project represents a breakthrough in automated content creation, utilizing state-of-the-art language models to generate compelling, coherent, and contextually appropriate content. The system incorporates advanced prompt engineering techniques, fine-tuning methodologies, and multi-modal capabilities to deliver professional-grade content at scale.",
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
      "Scalable deployment pipeline"
    ]
  },
  {
    id: "agentic-workflow-orchestrator",
    title: "Agentic Workflow Orchestrator",
    description: "A sophisticated orchestration platform for managing complex AI agent workflows with real-time monitoring and adaptive task distribution.",
    longDescription: "Built to address the challenges of coordinating multiple AI agents in enterprise environments, this orchestrator provides intelligent task distribution, conflict resolution, and performance optimization across agent networks.",
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
      "Enterprise-grade security"
    ]
  },
  {
    id: "llm-fine-tuning-toolkit",
    title: "LLM Fine-tuning Toolkit",
    description: "A comprehensive toolkit for fine-tuning large language models with efficient training pipelines and evaluation frameworks.",
    longDescription: "This toolkit simplifies the complex process of fine-tuning LLMs for domain-specific applications, providing optimized training strategies, evaluation metrics, and deployment utilities.",
    tags: ["Python", "PyTorch", "Hugging Face", "CUDA", "MLOps"],
    github: "https://github.com/davideasaf/llm-fine-tuning",
    date: "2023-11",
    status: "Stable",
    keyFeatures: [
      "Efficient training pipelines",
      "Comprehensive evaluation suite",
      "Memory optimization techniques",
      "Multi-GPU support",
      "Automated hyperparameter tuning"
    ]
  },
  {
    id: "intelligent-code-reviewer",
    title: "Intelligent Code Reviewer",
    description: "An AI-powered code review system that provides contextual feedback, security analysis, and performance optimization suggestions.",
    longDescription: "Leveraging advanced static analysis and machine learning techniques, this system provides intelligent code review capabilities that go beyond traditional linting to offer architectural insights and optimization recommendations.",
    tags: ["Python", "JavaScript", "AST", "Machine Learning", "CI/CD"],
    github: "https://github.com/davideasaf/intelligent-reviewer",
    date: "2023-09",
    status: "Maintenance",
    keyFeatures: [
      "Context-aware code analysis",
      "Security vulnerability detection",
      "Performance optimization hints",
      "Multi-language support",
      "CI/CD integration"
    ]
  }
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Projects by David Asaf | Generative AI & Machine Learning Portfolio</title>
        <meta name="description" content="Explore David Asaf's portfolio of AI and machine learning projects including neural content generation, agentic workflows, and intelligent automation systems." />
        <meta property="og:title" content="AI Projects by David Asaf | Charlotte, NC" />
        <meta property="og:description" content="Portfolio of innovative AI projects by David Asaf - Neural Content Generator, Agentic Workflow Orchestrator, and more." />
      </Helmet>
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              My <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A collection of AI and machine learning projects showcasing innovative solutions 
              for agentic workflows, content generation, and intelligent automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-[1.02] ${
                    project.featured ? 'ring-2 ring-primary/20' : ''
                  }`}
                >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      {project.featured && (
                        <Badge variant="default" className="w-fit">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{project.date}</span>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 4} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    {project.github && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-3 w-3" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demo && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg">
              <a href="https://github.com/davideasaf" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View All Projects on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;