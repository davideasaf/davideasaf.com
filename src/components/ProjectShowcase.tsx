import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Play } from "lucide-react";

const ProjectShowcase = () => {
  const projects = [
    {
      id: 1,
      title: "Neural Content Generator",
      description: "Advanced GPT-powered content generation platform with custom training capabilities and multi-modal output support.",
      image: "/placeholder.svg",
      tags: ["GPT-4", "Python", "React", "FastAPI"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: true
    },
    {
      id: 2,
      title: "AI-Powered Code Assistant",
      description: "Intelligent code completion and documentation generator built with transformer models and fine-tuned on technical documentation.",
      image: "/placeholder.svg",
      tags: ["Transformers", "TypeScript", "VS Code API", "Machine Learning"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: false
    },
    {
      id: 3,
      title: "Conversational AI Platform",
      description: "Real-time conversational AI system with voice recognition, natural language processing, and personalized responses.",
      image: "/placeholder.svg",
      tags: ["Speech Recognition", "NLP", "WebRTC", "Node.js"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: true
    },
    {
      id: 4,
      title: "Computer Vision Analytics",
      description: "Real-time object detection and analysis system for industrial applications using advanced computer vision techniques.",
      image: "/placeholder.svg",
      tags: ["OpenCV", "TensorFlow", "Python", "Docker"],
      github: "https://github.com",
      demo: null,
      featured: false
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore my latest work in AI engineering, machine learning, and innovative software solutions 
            that push the boundaries of what's possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-elegant ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              {project.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="default" className="bg-gradient-primary">
                    Featured
                  </Badge>
                </div>
              )}
              
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Button>
                  {project.demo && (
                    <Button variant="glow" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary-glow">
                  Learn More →
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline_primary" size="lg">
            <Github className="mr-2 h-5 w-5" />
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;