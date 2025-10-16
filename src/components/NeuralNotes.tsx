import { ArrowRight, Calendar, Clock, Play, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MediaDisplay } from "@/components/MediaDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_EVENTS, captureEvent, useObserveElementsOnce } from "@/lib/analytics";
import {
  type ContentItem,
  getPrimaryMedia,
  loadNeuralNotes,
  type NeuralNoteMetaWithCalculated,
} from "@/lib/content";

const NeuralNotes = () => {
  const [notes, setNotes] = useState<ContentItem<NeuralNoteMetaWithCalculated>[]>([]);
  const noteObservationKey = useMemo(() => notes.map((note) => note.slug).join("|"), [notes]);

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await loadNeuralNotes();
        setNotes(loaded.slice(0, 3));
      } catch (err) {
        console.error("Failed to load neural notes for home:", err);
      }
    };
    load();
  }, []);

  useObserveElementsOnce(
    "[data-note-card]",
    ANALYTICS_EVENTS.NEURAL_NOTE_CARD_VIEWED,
    (el) => ({
      note_slug: (el as HTMLElement).dataset.slug,
      featured: (el as HTMLElement).dataset.featured === "true",
      tags: (el as HTMLElement).getAttribute("data-tags")?.split(",") ?? [],
    }),
    undefined,
    [noteObservationKey],
  );

  const sectionId = "neural-notes";

  return (
    <section id={sectionId} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent rounded-full text-sm font-medium text-accent-foreground mb-6">
            🧠 Neural Notes
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            AI Insights &{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Deep Thoughts</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exploring the intersection of artificial intelligence, software engineering, and the
            future of technology through detailed analysis and hands-on experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {notes.map((note, index) => (
            <Card
              key={note.slug}
              data-note-card
              data-slug={note.slug}
              data-featured={(note.meta.featured && index === 0).toString()}
              data-tags={(note.meta.tags ?? []).join(",")}
              className={`group hover:shadow-elegant transition-all duration-300 ${note.meta.featured && index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(note.meta.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{note.meta.readTime}</span>
                    </div>
                  </div>
                  {note.meta.featured && (
                    <Badge variant="default" className="bg-gradient-primary">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Display primary media if available */}
                {getPrimaryMedia(note.meta).url && (
                  <MediaDisplay
                    meta={note.meta}
                    className="mb-4"
                    aspectRatio={note.meta.featured && index === 0 ? "wide" : "square"}
                  />
                )}

                {(note.meta.hasVideo || note.meta.hasAudio) && !getPrimaryMedia(note.meta).url && (
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Multimedia Content Available</span>
                      <div className="flex space-x-2">
                        {note.meta.hasVideo && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {note.meta.hasAudio && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {note.meta.hasVideo && note.meta.hasAudio
                        ? "Watch the video or listen to the audio version"
                        : note.meta.hasVideo
                          ? "Watch the video explanation"
                          : "Listen to the audio version"}
                    </p>
                  </div>
                )}

                <CardTitle
                  className={`group-hover:text-primary transition-colors ${note.meta.featured && index === 0 ? "text-2xl" : "text-xl"}`}
                >
                  {note.meta.title}
                </CardTitle>
                <CardDescription
                  className={`${note.meta.featured && index === 0 ? "text-base" : "text-sm"}`}
                >
                  {note.meta.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {note.meta.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full group-hover:text-primary p-0 justify-start"
                >
                  <Link
                    to={`/neural-notes/${note.slug}`}
                    onClick={() =>
                      captureEvent(ANALYTICS_EVENTS.NEURAL_NOTE_CARD_CLICKED, {
                        note_slug: note.slug,
                        position: index,
                      })
                    }
                  >
                    Continue Reading
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline_primary" size="lg">
            <Link to="/neural-notes">Explore All Neural Notes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NeuralNotes;
