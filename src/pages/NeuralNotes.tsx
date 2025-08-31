import { Calendar, Clock, Volume2, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ContentItem,
  formatDate,
  loadNeuralNotes,
  type NeuralNoteMetaWithCalculated,
} from "@/lib/content";
import { ANALYTICS_EVENTS, captureEvent } from "@/lib/analytics";

const NeuralNotes = () => {
  const [neuralNotes, setNeuralNotes] = useState<ContentItem<NeuralNoteMetaWithCalculated>[]>([]);
  const [loading, setLoading] = useState(true);

  // Load neural notes from markdown files
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const notes = await loadNeuralNotes();
        setNeuralNotes(notes);
      } catch (error) {
        console.error("Error loading neural notes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    if (!loading) {
      captureEvent(ANALYTICS_EVENTS.NEURAL_NOTES_LIST_VIEWED, {
        count: neuralNotes.length,
      });
    }
  }, [loading, neuralNotes.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading Neural Notes...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Neural Notes by David Asaf | AI Engineering Insights & Thought Leadership</title>
        <meta
          name="description"
          content="Deep insights on AI, agentic workflows, and the future of intelligent systems by David Asaf. Thoughts from the frontier of AI product engineering in Charlotte, NC."
        />
        <meta property="og:title" content="Neural Notes by David Asaf | AI Thought Leadership" />
        <meta
          property="og:description"
          content="Explore cutting-edge AI insights and thought leadership from David Asaf on generative AI, agentic workflows, and the future of intelligent systems."
        />
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

          <div className="space-y-8">
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

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">
              More neural notes coming soon. Subscribe to stay updated on the latest insights.
            </p>
            <Button asChild variant="outline" size="lg">
              <a href="mailto:david@davidasaf.com">Subscribe for Updates</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNotes;
