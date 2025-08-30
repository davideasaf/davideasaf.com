import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Mail, Download } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import headshotImage from "@/assets/headshot.png";

const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-accent rounded-full text-sm font-medium text-accent-foreground">
                🤖 AI Product Engineer & Developer
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Hi, I'm{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  David Asaf
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                AI Product Engineer building the future of agentic workflows and intelligent systems. 
                Transforming complex problems into elegant AI solutions.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" className="group">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline_primary" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-muted-foreground">Connect with me:</span>
              <div className="flex space-x-4">
                <a href="https://github.com/davideasaf" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="hover:text-primary">
                    <Github className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/davideasaf/" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="hover:text-primary">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </a>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-card rounded-2xl p-8 shadow-elegant border">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img 
                    src={headshotImage} 
                    alt="David Asaf - AI Product Engineer in Charlotte, NC"
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    loading="eager"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Latest Neural Note</h3>
                  <p className="text-muted-foreground">
                    "What Is Agile for an Agentic Workflow?" - Exploring how traditional methodologies 
                    need to evolve for AI agent teams.
                  </p>
                  <Button variant="glow" className="w-full">
                    Read Latest Insights
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-primary rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;