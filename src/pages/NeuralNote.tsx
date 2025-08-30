import Breadcrumb from "@/components/Breadcrumb";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    type ContentItem,
    formatDate,
    loadNeuralNotes,
    type NeuralNoteMetaWithCalculated,
} from "@/lib/content";
import { computeReadingTimeFromDOM } from "@/lib/readingTime";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Tag,
    Volume2,
    Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

const NeuralNote = () => {
	const { slug } = useParams<{ slug: string }>();
	const [neuralNote, setNeuralNote] =
		useState<ContentItem<NeuralNoteMetaWithCalculated> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [computedReadTime, setComputedReadTime] = useState<string | null>(null);

	useEffect(() => {
		const loadNote = async () => {
			try {
				setLoading(true);
				const notes = await loadNeuralNotes();
				const note = notes.find((n) => n.slug === slug);

				if (!note) {
					setError("Neural note not found");
					return;
				}

				setNeuralNote(note);
			} catch (err) {
				console.error("Error loading neural note:", err);
				setError("Failed to load neural note");
			} finally {
				setLoading(false);
			}
		};

		if (slug) {
			loadNote();
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

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<Navigation />
				<div className="pt-20 pb-12">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center space-y-4">
							<h1 className="text-2xl font-bold text-destructive">Error</h1>
							<p className="text-muted-foreground">
								{error || "Neural note not found"}
							</p>
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
				<meta property="article:author" content="David Asaf" />
				<meta
					property="article:published_time"
					content={neuralNote.meta.date}
				/>
				<link
					rel="canonical"
					href={`https://davidasaf.com/neural-notes/${slug}`}
				/>
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
							{(neuralNote.meta.videoUrl || neuralNote.meta.audioUrl) && (
								<Card className="overflow-hidden">
									<CardContent className="p-0">
										{neuralNote.meta.videoUrl && (
											<div className="space-y-4 p-6">
												<div className="flex items-center gap-2 text-primary">
													<Youtube className="h-5 w-5" />
													<span className="font-medium">
														Watch the discussion
													</span>
												</div>
												<div className="aspect-video">
													<iframe
														src={neuralNote.meta.videoUrl}
														title={`${neuralNote.meta.title} - Video Discussion`}
														className="w-full h-full rounded-lg"
														allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
														allowFullScreen
													/>
												</div>
											</div>
										)}

										{neuralNote.meta.audioUrl && !neuralNote.meta.videoUrl && (
											<div className="space-y-4 p-6">
												<div className="flex items-center gap-2 text-primary">
													<Volume2 className="h-5 w-5" />
													<span className="font-medium">
														Listen to the audio version
													</span>
												</div>
												<audio controls className="w-full">
													<source
														src={neuralNote.meta.audioUrl}
														type="audio/mpeg"
													/>
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
							{neuralNote.content && <neuralNote.content />}
						</div>
					</article>
				</div>
			</div>
		</div>
	);
};

export default NeuralNote;
