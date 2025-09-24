import { ArrowLeft, Calendar, ExternalLink, Github, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import { MediaDisplay } from "@/components/MediaDisplay";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_EVENTS, captureEvent } from "@/lib/analytics";
import { type ContentItem, formatDate, getProjectBySlug, type ProjectMeta } from "@/lib/content";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ContentItem<ProjectMeta> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!id) {
        if (isMounted) {
          setError("Project not found");
          setProject(null);
          setLoading(false);
        }
        return;
      }

      try {
        const result = await getProjectBySlug(id);
        if (!isMounted) return;
        if (!result) {
          setError("Project not found");
          setProject(null);
        } else {
          setError(null);
          setProject(result);
        }
      } catch (err) {
        console.error(`Failed to load project ${id}:`, err);
        if (!isMounted) return;
        setError("Unable to load project right now. Please try again later.");
        setProject(null);
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
  }, [id]);

  useEffect(() => {
    if (!loading && project) {
      captureEvent(ANALYTICS_EVENTS.PROJECT_DETAIL_VIEWED, { project_id: project.slug });
    }
  }, [loading, project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

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

  const ProjectContent = project.content;
  const hasMedia = Boolean(project.meta.videoUrl || project.meta.banner || project.meta.image);
  const ogImage = project.meta.banner ?? project.meta.image ?? undefined;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{project.meta.title} - AI Project by David Asaf</title>
        <meta name="description" content={project.meta.description} />
        <meta property="og:title" content={`${project.meta.title} - AI Project by David Asaf`} />
        <meta property="og:description" content={project.meta.description} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {project.meta.videoUrl && <meta property="og:video:url" content={project.meta.videoUrl} />}
        <link rel="canonical" href={`https://davideasaf.com/projects/${project.slug}`} />
      </Helmet>
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Projects", href: "/projects" },
              { label: project.meta.title },
            ]}
          />
          <Button variant="ghost" className="mb-8" asChild>
            <Link to="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <article className="space-y-8">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {project.meta.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {project.meta.status && (
                    <Badge
                      variant={
                        project.meta.status.toLowerCase().includes("production")
                          ? "default"
                          : "secondary"
                      }
                    >
                      {project.meta.status}
                    </Badge>
                  )}
                  {project.meta.featured && (
                    <Badge variant="default" className="bg-gradient-primary text-white">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(project.meta.date)}
                </div>
              </div>

              {hasMedia && (
                <div className="space-y-2">
                  <MediaDisplay
                    meta={project.meta}
                    aspectRatio={project.meta.videoUrl ? "video" : "wide"}
                    className="rounded-lg"
                  />
                  {project.meta.videoUrl && project.meta.videoTitle && (
                    <p className="text-sm text-muted-foreground text-center">{project.meta.videoTitle}</p>
                  )}
                </div>
              )}

              <p className="text-xl text-muted-foreground leading-relaxed">
                {project.meta.description}
              </p>

              <div className="flex gap-4 flex-wrap">
                {project.meta.github && (
                  <Button
                    asChild
                    onClick={() =>
                      captureEvent(ANALYTICS_EVENTS.PROJECT_DETAIL_EXTERNAL_CLICKED, {
                        project_id: project.slug,
                        target: "github",
                      })
                    }
                  >
                    <a href={project.meta.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
                )}
                {project.meta.demo && (
                  <Button
                    variant="outline"
                    asChild
                    onClick={() =>
                      captureEvent(ANALYTICS_EVENTS.PROJECT_DETAIL_EXTERNAL_CLICKED, {
                        project_id: project.slug,
                        target: "demo",
                      })
                    }
                  >
                    <a href={project.meta.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </header>

            {project.meta.keyFeatures && project.meta.keyFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.meta.keyFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {project.meta.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.meta.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <section className="markdown-content max-w-none">
              <ProjectContent />
            </section>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Project;
