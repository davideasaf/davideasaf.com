import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ContentItem,
  formatDate,
  getNeuralNoteBySlug,
  type NeuralNoteMetaWithCalculated,
} from "@/lib/content";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Volume2,
  Youtube,
  Home,
} from "lucide-react";

const NeuralNote = () => {
  const { slug } = useParams<{ slug: string }>();
  const [neuralNote, setNeuralNote] = useState<ContentItem<NeuralNoteMetaWithCalculated> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      if (!slug) {
        setError("No slug provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const note = await getNeuralNoteBySlug(slug);
        if (!note) {
          setError("Neural note not found");
        } else {
          setNeuralNote(note);
        }
      } catch (err) {
        console.error("Error loading neural note:", err);
        setError("Failed to load neural note");
      } finally {
        setLoading(false);
      }
    };

    loadNote();
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
                <p className="text-muted-foreground">Loading Neural Note...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !neuralNote) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Neural Note Not Found</h1>
                <p className="text-muted-foreground">{error || "The requested neural note could not be found."}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/neural-notes">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Neural Notes
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

  const { meta, content: MDXContent } = neuralNote;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{meta.title} - Neural Notes by David Asaf</title>
        <meta name="description" content={meta.excerpt} />
        <meta name="author" content="David Asaf" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content="David Asaf" />
        <meta property="article:published_time" content={meta.date} />
        <meta property="og:url" content={`https://davidasaf.com/neural-notes/${slug}`} />
        <link rel="canonical" href={`https://davidasaf.com/neural-notes/${slug}`} />
      </Helmet>

      <Navigation />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/neural-notes" className="hover:text-foreground transition-colors">Neural Notes</Link>
            <span>/</span>
            <span className="text-foreground">{meta.title}</span>
          </nav>

          <Button variant="ghost" className="mb-8" asChild>
            <Link to="/neural-notes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Neural Notes
            </Link>
          </Button>

          <article className="space-y-8">
            <header className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {meta.title}
                </h1>

                <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(meta.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {meta.readTime}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(meta.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Media Section */}
              {(meta.videoUrl || meta.audioUrl) && (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {meta.videoUrl && (
                      <div className="space-y-4 p-6">
                        <div className="flex items-center gap-2 text-primary">
                          <Youtube className="h-5 w-5" />
                          <span className="font-medium">
                            {meta.videoTitle || "Watch the discussion"}
                          </span>
                        </div>
                        <div className="aspect-video">
                          <iframe
                            src={meta.videoUrl}
                            title={meta.videoTitle || `${meta.title} - Video Discussion`}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}

                    {meta.audioUrl && !meta.videoUrl && (
                      <div className="space-y-4 p-6">
                        <div className="flex items-center gap-2 text-primary">
                          <Volume2 className="h-5 w-5" />
                          <span className="font-medium">Listen to the audio version</span>
                        </div>
                        <audio controls className="w-full">
                          <source src={meta.audioUrl} type="audio/mpeg" />
                          <track
                            kind="captions"
                            srcLang="en"
                            label="captions"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </header>

            {/* Article Content */}
            <div className="markdown-content max-w-none">
              {MDXContent && <MDXContent />}
            </div>

            {/* Article Footer */}
            <footer className="border-t pt-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Published on {formatDate(meta.date)} by David Asaf
                </div>
                <Button variant="outline" asChild>
                  <Link to="/neural-notes">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    More Neural Notes
                  </Link>
                </Button>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
};

export default NeuralNote;
