import { ArrowRight, Github, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headshotImage from "@/assets/headshot.png?width=200&height=200&fit=crop&crop=center";
import heroImage from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS, captureEvent } from "@/lib/analytics";
import { loadNeuralNotes } from "@/lib/content";

const HeroSection = () => {
  const [latestSlug, setLatestSlug] = useState<string | null>(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadLatest = async () => {
      try {
        setIsLoadingLatest(true);
        setHasError(false);
        const notes = await loadNeuralNotes();
        setLatestSlug(notes[0]?.slug ?? null);
      } catch (error) {
        console.error("Failed to load latest neural note:", error);
        setHasError(true);
        setLatestSlug(null);
      } finally {
        setIsLoadingLatest(false);
      }
    };
    loadLatest();
  }, []);

  const sectionId = "hero";

  return (
    <section id={sectionId} className="min-h-screen flex items-center relative overflow-hidden">
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
                AI Product Engineer building the future of agentic workflows and intelligent
                systems. Transforming complex problems into elegant AI solutions.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                variant="hero"
                size="lg"
                className="group"
                onClick={() =>
                  captureEvent(ANALYTICS_EVENTS.CTA_CLICKED, { cta_id: "view_my_work", page: "/" })
                }
              >
                <Link to="/#projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
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
                <a
                  href="https://www.linkedin.com/in/davideasaf/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon" className="hover:text-primary">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </a>
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
                    className="w-24 h-24 rounded-full object-cover object-center border-4 border-primary/20"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Latest Neural Note</h3>
                  {isLoadingLatest ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                      <div className="h-10 bg-muted rounded animate-pulse"></div>
                    </div>
                  ) : hasError ? (
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm">
                        Unable to load latest insights at the moment.
                      </p>
                      <Button asChild variant="glow" className="w-full">
                        <Link to="/neural-notes">Browse All Insights</Link>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground">
                        "What Is Agile for an Agentic Workflow?" - Exploring how traditional
                        methodologies need to evolve for AI agent teams.
                      </p>
                      <Button asChild variant="glow" className="w-full">
                        <Link to={latestSlug ? `/neural-notes/${latestSlug}` : "/neural-notes"}>
                          Read Latest Insights
                        </Link>
                      </Button>
                    </>
                  )}
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
