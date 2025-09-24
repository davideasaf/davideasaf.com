import { ExternalLink, Github, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MediaDisplay } from "@/components/MediaDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ANALYTICS_EVENTS, captureEvent, useObserveElementsOnce } from "@/lib/analytics";
import { type ContentItem, getPrimaryMedia, loadProjects, type ProjectMeta } from "@/lib/content";

const ProjectShowcase = () => {
  const [projects, setProjects] = useState<ContentItem<ProjectMeta>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await loadProjects();
        // Take the first 4 projects for showcase
        setProjects(loaded.slice(0, 4));
      } catch (err) {
        console.error("Failed to load projects for showcase:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sectionId = "projects";

  useObserveElementsOnce("[data-pj-card]", ANALYTICS_EVENTS.PROJECT_CARD_VIEWED, (el) => ({
    project_id: (el as HTMLElement).dataset.pid,
    featured: (el as HTMLElement).dataset.featured === "true",
  }));

  return (
    <section id={sectionId} className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Featured{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore my latest work in AI engineering, machine learning, and innovative software
            solutions that push the boundaries of what's possible.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading projects...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card
                key={project.slug}
                data-pj-card
                data-pid={project.slug}
                data-featured={project.meta.featured}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-elegant ${project.meta.featured ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                {project.meta.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="default" className="bg-gradient-primary">
                      Featured
                    </Badge>
                  </div>
                )}

                {/* Display primary media if available */}
                {getPrimaryMedia(project.meta).url ? (
                  <MediaDisplay meta={project.meta} className="w-full" aspectRatio="video" />
                ) : (
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.meta.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {project.meta.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.meta.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.meta.tags.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.meta.tags.length - 4} more
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    {project.meta.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          captureEvent(ANALYTICS_EVENTS.PROJECT_EXTERNAL_CLICKED, {
                            project_id: project.slug,
                            target: "github",
                          })
                        }
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </Button>
                    )}
                    {project.meta.demo && (
                      <Button
                        variant="glow"
                        size="sm"
                        onClick={() =>
                          captureEvent(ANALYTICS_EVENTS.PROJECT_EXTERNAL_CLICKED, {
                            project_id: project.slug,
                            target: "demo",
                          })
                        }
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Demo
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary-glow"
                    asChild
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      onClick={() =>
                        captureEvent(ANALYTICS_EVENTS.PROJECT_CARD_CLICKED, {
                          project_id: project.slug,
                        })
                      }
                    >
                      Learn More →
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline_primary" size="lg">
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
