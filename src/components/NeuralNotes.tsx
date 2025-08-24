import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Play, Volume2, ArrowRight } from "lucide-react";

const NeuralNotes = () => {
  const posts = [
    {
      id: 1,
      title: "The Future of Large Language Models: Beyond GPT-4",
      excerpt: "Exploring the next generation of AI models and their potential impact on software development, creativity, and human-computer interaction.",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["LLM", "GPT-4", "AI Research"],
      hasVideo: true,
      hasAudio: false,
      videoUrl: "https://youtube.com/embed/example",
      featured: true
    },
    {
      id: 2,
      title: "Building Production-Ready AI Applications",
      excerpt: "A comprehensive guide to deploying AI models at scale, including best practices for monitoring, versioning, and maintaining AI systems.",
      date: "2024-01-10",
      readTime: "12 min read",
      tags: ["MLOps", "Production", "Scaling"],
      hasVideo: false,
      hasAudio: true,
      audioUrl: "https://example.com/audio/post2.mp3",
      featured: false
    },
    {
      id: 3,
      title: "Prompt Engineering: An Art and Science",
      excerpt: "Deep dive into advanced prompt engineering techniques that can dramatically improve AI model performance and reliability.",
      date: "2024-01-05",
      readTime: "10 min read",
      tags: ["Prompt Engineering", "AI", "Best Practices"],
      hasVideo: true,
      hasAudio: true,
      videoUrl: "https://youtube.com/embed/example2",
      audioUrl: "https://example.com/audio/post3.mp3",
      featured: false
    }
  ];

  return (
    <section id="neural-notes" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent rounded-full text-sm font-medium text-accent-foreground mb-6">
            🧠 Neural Notes
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            AI Insights & <span className="bg-gradient-primary bg-clip-text text-transparent">Deep Thoughts</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exploring the intersection of artificial intelligence, software engineering, and the future of technology 
            through detailed analysis and hands-on experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card key={post.id} className={`group hover:shadow-elegant transition-all duration-300 ${post.featured && index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  {post.featured && (
                    <Badge variant="default" className="bg-gradient-primary">
                      Featured
                    </Badge>
                  )}
                </div>

                {(post.hasVideo || post.hasAudio) && (
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Multimedia Content Available</span>
                      <div className="flex space-x-2">
                        {post.hasVideo && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {post.hasAudio && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {post.hasVideo && post.hasAudio 
                        ? "Watch the video or listen to the audio version"
                        : post.hasVideo 
                        ? "Watch the video explanation"
                        : "Listen to the audio version"
                      }
                    </p>
                  </div>
                )}

                <CardTitle className={`group-hover:text-primary transition-colors ${post.featured && index === 0 ? 'text-2xl' : 'text-xl'}`}>
                  {post.title}
                </CardTitle>
                <CardDescription className={`${post.featured && index === 0 ? 'text-base' : 'text-sm'}`}>
                  {post.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="ghost" className="w-full group-hover:text-primary p-0 justify-start">
                  Continue Reading
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline_primary" size="lg">
            Explore All Neural Notes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NeuralNotes;