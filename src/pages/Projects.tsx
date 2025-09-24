import { Calendar, ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { MediaDisplay } from "@/components/MediaDisplay";
import Navigation from "@/components/Navigation";
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
import { type ContentItem, formatDate, loadProjects, type ProjectMeta } from "@/lib/content";

const Projects = () => {
  const [projects, setProjects] = useState<ContentItem<ProjectMeta>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const loaded = await loadProjects();
        if (!isMounted) return;
        setProjects(loaded);
        setError(null);
      } catch (err) {
        console.error("Failed to load projects: ", err);
        if (!isMounted) return;
        setError(
          "We couldn't load the projects portfolio right now. Please refresh the page or try again in a moment.",
        );
        captureEvent(ANALYTICS_EVENTS.PROJECT_LIST_LOAD_FAILED, {
          error_message: err instanceof Error ? err.message : String(err),
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  useObserveElementsOnce("[data-project-card]", ANALYTICS_EVENTS.PROJECT_CARD_VIEWED, (el) => ({
    project_id: (el as HTMLElement).dataset.projectId,
    featured: (el as HTMLElement).dataset.featured === "true",
  }));
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Projects by David Asaf | Generative AI & Machine Learning Portfolio</title>
        <meta
          name="description"
          content="Explore David Asaf's portfolio of AI and machine learning projects including neural content generation, agentic workflows, and intelligent automation systems."
        />
        <meta property="og:title" content="AI Projects by David Asaf | Charlotte, NC" />
        <meta
          property="og:description"
          content="Portfolio of innovative AI projects by David Asaf - Neural Content Generator, Agentic Workflow Orchestrator, and more."
        />
      </Helmet>
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              My <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A collection of AI and machine learning projects showcasing innovative solutions for
              agentic workflows, content generation, and intelligent automation.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground" aria-live="polite">
              Loading projects…
            </div>
          ) : error ? (
            <div
              className="text-center py-12 text-muted-foreground"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No projects available just yet. Check back soon for new updates!
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project) => {
                const hasMedia = Boolean(
                  project.meta.videoUrl || project.meta.banner || project.meta.image,
                );
                return (
                  <Card
                    key={project.slug}
                    data-project-card
                    data-project-id={project.slug}
                    data-featured={project.meta.featured}
                    className={`transition-all duration-300 hover:shadow-elegant hover:scale-[1.02] ${
                      project.meta.featured ? "ring-2 ring-primary/20" : ""
                    }`}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      className="block"
                      onClick={() =>
                        captureEvent(ANALYTICS_EVENTS.PROJECT_CARD_CLICKED, {
                          project_id: project.slug,
                        })
                      }
                    >
                      {hasMedia && (
                        <div className="p-6 pb-0">
                          <ErrorBoundary
                            resetKeys={[
                              project.meta.videoUrl,
                              project.meta.banner,
                              project.meta.image,
                            ]}
                            fallback={(err) => (
                              <div
                                className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                                role="alert"
                                aria-live="assertive"
                              >
                                <p className="font-medium">Preview unavailable</p>
                                <p>{err.message}</p>
                              </div>
                            )}
                            onError={(err) =>
                              captureEvent(ANALYTICS_EVENTS.MEDIA_RENDER_FAILED, {
                                project_id: project.slug,
                                media_type: project.meta.videoUrl
                                  ? "video"
                                  : project.meta.banner
                                    ? "banner"
                                    : "image",
                                media_url:
                                  project.meta.videoUrl ??
                                  project.meta.banner ??
                                  project.meta.image ??
                                  null,
                                error_message: err.message,
                                source: "project-card-boundary",
                              })
                            }
                          >
                            <MediaDisplay
                              meta={project.meta}
                              aspectRatio={project.meta.videoUrl ? "video" : "wide"}
                              className="rounded-lg"
                            />
                          </ErrorBoundary>
                        </div>
                      )}
                      <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <CardTitle className="text-xl">{project.meta.title}</CardTitle>
                            {project.meta.featured && (
                              <Badge variant="default" className="w-fit">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{formatDate(project.meta.date)}</span>
                          </div>
                        </div>
                        <CardDescription className="text-base leading-relaxed">
                          {project.meta.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {project.meta.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.meta.tags.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.meta.tags.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Link>
                    <CardFooter className="flex flex-wrap gap-3 pt-0">
                      {project.meta.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={project.meta.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              captureEvent(ANALYTICS_EVENTS.PROJECT_EXTERNAL_CLICKED, {
                                project_id: project.slug,
                                target: "github",
                              })
                            }
                          >
                            <Github className="mr-2 h-3 w-3" />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.meta.demo && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={project.meta.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              captureEvent(ANALYTICS_EVENTS.PROJECT_EXTERNAL_CLICKED, {
                                project_id: project.slug,
                                target: "demo",
                              })
                            }
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

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
