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
import { SITE_NAME, SITE_URL, getAbsoluteUrl } from "@/lib/config";
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

  const pageUrl = `${SITE_URL}/neural-notes/${slug}`;
  const pageTitle = `${neuralNote.meta.title} - Neural Notes by David Asaf`;
  const ogImage = getNeuralNoteOgImage(neuralNote.meta.tags, neuralNote.meta.title);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={neuralNote.meta.excerpt} />
        <meta name="author" content="David Asaf" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph tags */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={neuralNote.meta.title} />
        <meta property="og:description" content={neuralNote.meta.excerpt} />
        <meta property="og:image" content={getAbsoluteUrl(ogImage)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={neuralNote.meta.title} />
        <meta property="article:published_time" content={neuralNote.meta.date} />
        <meta property="article:author" content="David Asaf" />
        {(neuralNote.meta.tags ?? []).map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        {neuralNote.meta.videoUrl && (
          <>
            <meta property="og:video" content={neuralNote.meta.videoUrl} />
            <meta property="og:video:url" content={neuralNote.meta.videoUrl} />
            <meta property="og:video:type" content="text/html" />
          </>
        )}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={neuralNote.meta.title} />
        <meta name="twitter:description" content={neuralNote.meta.excerpt} />
        <meta name="twitter:image" content={getAbsoluteUrl(ogImage)} />
        <meta name="twitter:image:alt" content={neuralNote.meta.title} />
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
            {/* Hero Header with Featured Image Background */}
            {neuralNote.meta.banner ? (
              <header className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
                {/* Hero Image Background */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={neuralNote.meta.banner}
                    alt={neuralNote.meta.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-6">
                      {neuralNote.meta.title}
                    </h1>

                    <div className="flex items-center gap-4 text-white flex-wrap justify-center mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(neuralNote.meta.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {neuralNote.meta.readTime ?? computedReadTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {(neuralNote.meta.tags ?? []).map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-black/90 text-white font-medium px-3 py-1 border-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </header>
            ) : (
              /* Fallback: Standard Header when no banner */
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

                {/* Media Section for video/audio */}
                <MediaDisplay meta={neuralNote.meta} aspectRatio="video" />
              </header>
            )}

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
