import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ContentItem,
  formatDate,
  getProjectBySlug,
  type ProjectMeta,
} from "@/lib/content";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Tag,
  Home,
} from "lucide-react";

const Project = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ContentItem<ProjectMeta> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) {
        setError("No slug provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const proj = await getProjectBySlug(slug);
        if (!proj) {
          setError("Project not found");
        } else {
          setProject(proj);
        }
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading Project...</p>
              </div>
            </div>
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Project Not Found</h1>
                <p className="text-muted-foreground">{error || "The requested project could not be found."}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { meta, content: MDXContent } = project;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{meta.title} - David Asaf's AI Projects</title>
        <meta name="description" content={meta.description} />
        <meta name="author" content="David Asaf" />
        <meta property="og:title" content={`${meta.title} - David Asaf's AI Project`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content="David Asaf" />
        <meta property="article:published_time" content={meta.date} />
        <meta property="og:url" content={`https://davidasaf.com/projects/${slug}`} />
        <link rel="canonical" href={`https://davidasaf.com/projects/${slug}`} />
      </Helmet>

      <Navigation />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/projects" className="hover:text-foreground transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-foreground">{meta.title}</span>
          </nav>

          <Button variant="ghost" className="mb-8" asChild>
            <Link to="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold">{meta.title}</h1>
                {meta.featured && (
                  <Badge variant="default">Featured Project</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(meta.date)}
                </div>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {meta.description}
              </p>

              <div className="flex gap-4">
                {meta.github && (
                  <Button asChild>
                    <a href={meta.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
                )}
                {meta.demo && (
                  <Button variant="outline" asChild>
                    <a href={meta.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Project Content */}
            {MDXContent && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="markdown-content">
                  <MDXContent />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {meta.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Footer */}
            <div className="border-t pt-8">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Project by David Asaf • {formatDate(meta.date)}
                </div>
                <Button variant="outline" asChild>
                  <Link to="/projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    More Projects
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
