import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import { MediaDisplay } from "@/components/MediaDisplay";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS, captureEvent, useScrollProgressMilestones } from "@/lib/analytics";
import {
  type ContentItem,
  formatDate,
  getNeuralNoteBySlugSync,
  getNeuralNoteOgImage,
  type NeuralNoteMetaWithCalculated,
} from "@/lib/content";
import { computeReadingTimeFromDOM } from "@/lib/readingTime";

const NeuralNote = () => {
  const { slug } = useParams<{ slug: string }>();
  const [neuralNote, setNeuralNote] = useState<ContentItem<NeuralNoteMetaWithCalculated> | null>(
    null,
  );
  const [loading, _setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [computedReadTime, setComputedReadTime] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const note = getNeuralNoteBySlugSync(slug);
    if (!note) {
      setError("Neural note not found");
      setNeuralNote(null);
    } else {
      setError(null);
      setNeuralNote(note);
    }
  }, [slug]);

  // After content renders, only compute reading time from DOM if missing in metadata
  useEffect(() => {
    const compute = async () => {
      try {
        const el = document.querySelector(".markdown-content");
        if (!el) return;
        const rt = await computeReadingTimeFromDOM(el);
        setComputedReadTime(rt);
      } catch {
        // noop
      }
    };
    if (!loading && neuralNote && !neuralNote.meta.readTime) {
      // Wait a tick to ensure MDX content mounted
      requestAnimationFrame(() => compute());
    } else {
      setComputedReadTime(null);
    }
  }, [loading, neuralNote]);

  useEffect(() => {
    if (!loading && neuralNote) {
      captureEvent(ANALYTICS_EVENTS.NEURAL_NOTE_VIEWED, {
        note_slug: neuralNote.slug,
        read_time_meta: neuralNote.meta.readTime,
        tags: neuralNote.meta.tags ?? [],
      });
    }
  }, [loading, neuralNote]);

  useScrollProgressMilestones(
    ".markdown-content",
    ANALYTICS_EVENTS.NEURAL_NOTE_READ_PROGRESS,
    neuralNote ? { note_slug: neuralNote.slug } : undefined,
  );

  // no loading state — render immediately or show error

  if (error || !neuralNote) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-destructive">Error</h1>
              <p className="text-muted-foreground">{error || "Neural note not found"}</p>
              <Button asChild>
                <Link to="/neural-notes">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Neural Notes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{neuralNote.meta.title} - Neural Notes by David Asaf</title>
        <meta name="description" content={neuralNote.meta.excerpt} />
        <meta name="author" content="David Asaf" />
        <meta property="og:title" content={neuralNote.meta.title} />
        <meta property="og:description" content={neuralNote.meta.excerpt} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={getNeuralNoteOgImage(neuralNote.meta.tags, neuralNote.meta.title)}
        />
        <meta property="article:author" content="David Asaf" />
        <meta property="article:published_time" content={neuralNote.meta.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={getNeuralNoteOgImage(neuralNote.meta.tags, neuralNote.meta.title)}
        />
        <link rel="canonical" href={`https://davidasaf.com/neural-notes/${slug}`} />
      </Helmet>
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Neural Notes", href: "/neural-notes" },
              { label: neuralNote?.meta.title || "Loading..." },
            ]}
          />

          <article className="space-y-8">
            <header className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {neuralNote.meta.title}
                </h1>

                <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(neuralNote.meta.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {neuralNote.meta.readTime ?? computedReadTime}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(neuralNote.meta.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Media Section */}
              <MediaDisplay meta={neuralNote.meta} aspectRatio="video" />
            </header>

            {/* Article Content */}
            <div className="markdown-content max-w-none">
              {neuralNote.content && <neuralNote.content />}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default NeuralNote;
