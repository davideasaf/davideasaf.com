import { Calendar, Clock, Volume2, Youtube } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MediaDisplay } from "@/components/MediaDisplay";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_EVENTS, captureEvent } from "@/lib/analytics";
import { SITE_NAME, SITE_URL, getAbsoluteUrl } from "@/lib/config";
import {
  type ContentItem,
  formatDate,
  getNeuralNotesSync,
  getPrimaryMedia,
  type NeuralNoteMetaWithCalculated,
} from "@/lib/content";
import { prefetchDetailPages } from "@/lib/prefetch";

const NeuralNotes = () => {
  const neuralNotes = useMemo<ContentItem<NeuralNoteMetaWithCalculated>[]>(
    () => getNeuralNotesSync(),
    [],
  );
  useEffect(() => {
    prefetchDetailPages();
  }, []);

  useEffect(() => {
    captureEvent(ANALYTICS_EVENTS.NEURAL_NOTES_LIST_VIEWED, {
      count: neuralNotes.length,
    });
  }, [neuralNotes.length]);

  const pageUrl = `${SITE_URL}/neural-notes`;
  const pageTitle = "Neural Notes by David Asaf | AI Engineering Insights & Thought Leadership";
  const pageDescription =
    "Deep insights on AI, agentic workflows, and the future of intelligent systems by David Asaf. Thoughts from the frontier of AI product engineering in Charlotte, NC.";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content={getAbsoluteUrl("/assets/blog/ai-workflow-example.png")}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Neural Notes - AI Insights by David Asaf" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content={getAbsoluteUrl("/assets/blog/ai-workflow-example.png")}
        />
        <meta name="twitter:image:alt" content="Neural Notes - AI Insights by David Asaf" />
      </Helmet>
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Neural Notes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Deep insights on AI, agentic workflows, and the future of intelligent systems.
              Thoughts from the frontier of AI product engineering.
            </p>
          </div>

          <div className="space-y-8" data-prefetch="details">
            {neuralNotes.map((note) => (
              <Link
                key={note.slug}
                to={`/neural-notes/${note.slug}`}
                onClick={() =>
                  captureEvent(ANALYTICS_EVENTS.NEURAL_NOTE_CARD_CLICKED, {
                    note_slug: note.slug,
                  })
                }
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-[1.01] ${
                    note.meta.featured ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-2xl">{note.meta.title}</CardTitle>
                          {note.meta.featured && <Badge variant="default">Featured</Badge>}
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground text-sm flex-wrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(note.meta.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {note.meta.readTime}
                          </div>
                          {note.meta.videoUrl && (
                            <div className="flex items-center gap-2 text-primary">
                              <Youtube className="h-4 w-4" />
                              <span>Video available</span>
                            </div>
                          )}
                          {note.meta.audioUrl && (
                            <div className="flex items-center gap-2 text-primary">
                              <Volume2 className="h-4 w-4" />
                              <span>Audio available</span>
                            </div>
                          )}
                        </div>

                        <CardDescription className="text-base leading-relaxed">
                          {note.meta.excerpt}
                        </CardDescription>

                        {/* Display primary media if available */}
                        {getPrimaryMedia(note.meta).url && (
                          <div className="mt-4">
                            <MediaDisplay meta={note.meta} className="w-full" aspectRatio="video" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {(note.meta.tags ?? []).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNotes;
