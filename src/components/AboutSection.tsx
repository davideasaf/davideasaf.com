import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, Rocket, Users, Download } from "lucide-react";

const AboutSection = () => {
  const skills = [
    "Generative AI", "Machine Learning", "Python", "TypeScript", "React", "Node.js",
    "TensorFlow", "PyTorch", "OpenAI API", "Langchain", "Vector Databases", "FastAPI",
    "Docker", "Kubernetes", "AWS", "GCP", "MLOps", "Prompt Engineering"
  ];

  const highlights = [
    {
      icon: Brain,
      title: "AI Research & Development",
      description: "Specializing in generative AI applications, from concept to production deployment."
    },
    {
      icon: Code,
      title: "Full-Stack Engineering",
      description: "Building end-to-end AI-powered applications with modern web technologies."
    },
    {
      icon: Rocket,
      title: "Product Innovation",
      description: "Translating cutting-edge AI research into practical, user-centered products."
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Leading cross-functional teams to deliver AI solutions that drive business impact."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">
                Crafting Tomorrow's{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  AI Solutions
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm David Asaf, a passionate AI Product Engineer specializing in agentic workflows 
                and generative AI systems. I focus on bridging the gap between cutting-edge AI research 
                and practical business applications that deliver real value.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                My expertise lies in orchestrating AI agents, designing human-AI collaboration patterns, 
                and rethinking traditional development methodologies for the AI era. I believe we're at 
                an inflection point where the right approach to AI can accelerate teams dramatically.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm py-1">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </Button>
              <Button variant="outline_primary" size="lg">
                Let's Collaborate
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {highlights.map((highlight, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                      <highlight.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {highlight.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;