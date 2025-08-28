import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Tag, Youtube, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

const neuralNotes = [
  {
    id: "agile-agentic-workflow",
    title: "What Is Agile for an Agentic Workflow?",
    description: "Exploring how traditional methodologies need to evolve for AI agent teams. When Agile first appeared, it looked almost heretical, but it unlocked productivity leaps. Generative AI is at the same inflection point.",
    excerpt: "When Agile first appeared, it looked almost heretical. Two-week sprints? Daily standups? Shipping in increments instead of one massive release? But for the teams who adopted it early, Agile unlocked productivity leaps the rest of the industry couldn't ignore...",
    date: "2024-12-15",
    readTime: "12 min read",
    tags: ["Agile", "AI Workflow", "Product Management", "Leadership"],
    featured: true,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder - replace with actual video
    audioUrl: null, // Will be populated when available
    content: `# What Is Agile for an Agentic Workflow?

## The Inflection Point

When Agile first appeared, it looked almost heretical. Two-week sprints? Daily standups? Shipping in increments instead of one massive release?  

But for the teams who adopted it early, Agile unlocked productivity leaps the rest of the industry couldn't ignore. They moved faster, delivered more reliably, and learned from their users in real time.  

Yet many organizations that jumped in late saw far less benefit. They kept their rigid org charts, their approval gates, their command-and-control habits… and then wondered why "Agile" didn't work for them. Agile wasn't broken — their application of it was.  

Generative AI is at the same inflection point.  

Depending on which study you read, AI makes developers **slower** by ~19% or **faster** by 50% or more. One 2025 randomized trial from METR found experienced developers took longer when using AI tools, even though they *felt* faster[4]. Meanwhile, controlled trials at Microsoft, GitHub, and MIT Sloan show that, with the right conditions, AI-assisted teams move meaningfully faster[5].  

So which is it? Is AI an accelerator or a drag?  

The truth is: just like Agile in its early days, AI doesn't fail because of the tools. It fails when we try to bolt it onto yesterday's process.

---

## What Agile Actually Solved

It's worth reminding ourselves: Agile wasn't designed to be sacred. It was designed to solve a specific problem — **human bottlenecks in software development.**

Agile (and later DevOps/Lean practices) reduced context-switching, cut communication overhead, and gave people shorter feedback loops. DORA research has shown for over a decade that teams with these Lean/Agile/DevOps capabilities consistently score better on the "four key" delivery metrics:  

- Lead time for changes  
- Deployment frequency  
- Mean time to restore (MTTR)  
- Change failure rate  

And those better delivery outcomes correlate with stronger organizational performance[1]. That's not "proof" in the mathematical sense, but it's strong, repeated evidence: practices that reduce **human friction** lead to better results.

But here's the catch: AI teammates don't suffer from the same bottlenecks. They don't forget. They don't need a sprint to "focus." They don't need a standup to sync. So why are we asking agents to play by the same rules we built for humans?

---

## A Note from My Own Experience

For me, the moment everything shifted was late 2024, when reasoning models started to blossom. Suddenly, you could chain together very complex agentic workflows in a way that wasn't practical before. That's when I realized: this isn't just a productivity boost, this is the foundation of a new kind of software development lifecycle.

And here's the key part: I've personally shipped solutions in **days** that would have taken my teams **weeks** in the old model. But it didn't happen by casually opening a chatbot and tossing in prompts. It happened because I put real structure in place — clear tooling, clear strategies, and clear pre-planning. I treated the AI not as a toy, but as a teammate that needed context, guardrails, and integration with the rest of the lifecycle.

That's what makes me confident: generative AI *does* accelerate. But only when you design the workflow around it. If you just drop it into yesterday's process, you'll feel the drag instead of the lift.

---

## Where the Friction Shows

Take a few core Agile ceremonies and imagine them in an agentic workflow:

- **Sprint Planning**  
  With humans, it's essential. With 100+ agents, it doesn't scale. The concept of a "two-week block of work" breaks down when work can be generated, tested, and iterated in hours.  

- **Retrospectives**  
  Surprisingly valuable. Agents can generate their own improvement rules, run self-checks, and carry lessons forward without forgetting. Humans then shift into validating and refining those learnings.  

- **Standups**  
  Less about "what I did yesterday" and more about **observability dashboards**. Humans don't need to hear what every agent did; they need to see patterns, anomalies, and insights.

What emerges is a lifecycle that looks familiar in spirit — feedback loops, visibility, incremental progress — but is structurally different. The bottlenecks have moved.

---

## Imagining the Future Lifecycle

So what does tomorrow's team actually look like?

Instead of five to ten engineers, a designer, and a product manager trying to align across a dozen handoffs, you may see **pods of three multifunction humans** working alongside hundreds of agents:  

- One who's a product strategist *and* developer  
- One who's a UX lead *and* developer  
- One who's a business analyst *and* developer  

Together, they orchestrate agents that handle scaffolding, refactoring, testing, documentation, monitoring, and even suggesting experiments.  

Leadership shifts from "approve every ticket" to providing **strategic guidance** — ensuring the team's direction aligns with business priorities, not micromanaging the implementation.  

And here's the kicker: this doesn't mean fewer jobs. It means companies can afford to place more bets.  

Today, a large enterprise might review three major business cases per quarter. Tomorrow, they could have dozens of feature-sized bets running in parallel — each backed by small human pods + large agent clusters. Some will fail fast, but the winners will bubble up far faster to leadership. That's how innovation portfolios get wider without ballooning cost.

---

## The Cloud Analogy (Supporting Cast)

If Agile is the main analogy, Cloud is the supporting one.  

Cloud felt slow for many companies at first. Lift-and-shift migrations took years, and the early adopters who simply swapped their data center for AWS didn't see much speed.  

But once teams redesigned their operating models — autoscaling, DevOps pipelines, microservices, "you build it, you run it" ownership — Cloud went from overhead to accelerant[3].  

Generative AI will follow the same arc. If you just replace "developer" with "agent" in your Jira board, you'll get pain. If you redesign your operating model for agentic workflows, you'll get acceleration.

---

## Bets I'm Taking in Leadership

This isn't just theory. Here are some of the bets I'm actively placing in my own leadership work:

- **Human-guided retrospectives for agents.**  
  Retrospectives shouldn't be reserved for humans. I'm testing workflows where agents generate self-improvement rules — then humans review, refine, and feed them back in. Think of it like shared libraries: some instructions can be reused across projects, while others must be hyper-specific. Done well, this compounds learning across both agents and teams.

- **Investing in orchestrators, not just chatbots.**  
  Buying everyone an Enterprise Copilot license or provisioning Cloud Code is not enough. Without training, mentorship, and space to experiment, broad tool access is just noise. I believe the real differentiator will be developing "orchestrator" talent — humans who know how to design agent workflows, set context, and validate outputs.  

- **Protecting the human layer.**  
  The rise of agents doesn't diminish the value of humans. If anything, it raises the stakes. We need to double down on mentorship, discovery, and discourse so people learn how to work with these tools effectively. That's how we'll get to efficiency faster.

---

## Where Leaders Go from Here

If you're a technical leader, don't ask:  
"Does Agile work with AI?"  

Instead, ask:  
"What is the Agile of the AI era?"  

The answer doesn't exist in a handbook yet. Just like Agile itself, it will emerge through experiments, hardened practices, and community consensus.  

What you can do now is start running **structured bets**: test retrospectives with agents, experiment with orchestrator roles, create safe spaces for your developers to experiment and mentor each other. Track the outcomes, not just in speed but in precision and resilience.  

History tells us this clearly. The teams that embraced Agile early — from Sabre's XP pilots to Flickr's "10 deploys a day" — outpaced their peers by orders of magnitude[2]. The companies that re-architected for Cloud (Netflix's AWS migration is the classic example) reaped resilience and velocity that laggards struggled to match[3].  

Early adopters who experiment with intent don't just move faster; they set the standard everyone else eventually follows.  

The question is: will your organization help write that playbook, or wait for someone else to hand it to you?

---

## Footnotes

[1] [State of DevOps (DORA) 2024 Report](https://services.google.com/fh/files/misc/state-of-devops-2024.pdf) – Lean/Agile/DevOps capabilities linked to delivery + organizational performance.  
[2] [Sabre XP Case Study](https://ieeexplore.ieee.org/document/1238033) – One of the earliest documented Agile/XP adoptions; Flickr's "10 deploys a day" (2009) is another classic.  
[3] [Netflix AWS Migration](https://queue.acm.org/detail.cfm?id=3454124) – Multi-year cloud migration that enabled resilience and velocity.  
[4] [METR 2025 RCT](https://www.itpro.com/software/development/think-ai-coding-tools-are-speeding-up-work-think-again-theyre-actually-slowing-developers-down) – Experienced devs 19% slower with AI tools.  
[5] [GitHub Copilot RCT](https://arxiv.org/abs/2302.06527) – Developers up to 55% faster in scoped tasks.`
  },
  {
    id: "future-of-llms",
    title: "The Future of LLMs: Beyond Chat Interfaces",
    description: "An exploration of how large language models will evolve beyond conversational interfaces into specialized, domain-specific tools that integrate seamlessly into professional workflows.",
    excerpt: "While chat interfaces captured our imagination, the real transformation lies in LLMs becoming invisible infrastructure that powers domain-specific applications, from code generation to scientific research...",
    date: "2024-12-01",
    readTime: "8 min read",
    tags: ["LLMs", "AI Infrastructure", "Future Tech", "Product Strategy"],
    featured: false,
    videoUrl: null, // Will be populated when available
    audioUrl: "https://example.com/audio/future-of-llms.mp3", // Placeholder
    content: `# The Future of LLMs: Beyond Chat Interfaces

While the current wave of LLM adoption has been dominated by chat interfaces, the real transformation is just beginning. The future lies not in better chatbots, but in LLMs becoming invisible infrastructure that powers domain-specific applications across every industry.

## The Infrastructure Layer

LLMs are transitioning from novelty tools to foundational infrastructure. Just as databases became invisible to end users while powering every application, LLMs will disappear into the background of our software stack.

This shift means:
- **Specialized Models**: Domain-specific fine-tuned models for healthcare, legal, finance
- **Embedded Intelligence**: AI capabilities built directly into existing tools
- **Seamless Integration**: Natural language as a universal interface layer

## Beyond Text Generation

The next generation of LLM applications will go far beyond text generation:

- **Multimodal Reasoning**: Combining text, images, audio, and structured data
- **Action-Oriented**: Models that can execute tasks, not just describe them
- **Context-Aware**: Deep integration with personal and organizational knowledge

## The Professional Workflow Revolution

Instead of switching to a separate AI assistant, professionals will find intelligence embedded in their existing tools:

- Code editors with built-in pair programming
- Design tools with contextual creative assistance  
- Spreadsheets with natural language querying
- Documentation that writes and updates itself

This evolution represents a fundamental shift from AI as a separate tool to AI as integrated intelligence.`
  }
];

const NeuralNotes = () => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const selectedNoteData = neuralNotes.find(n => n.id === selectedNote);

  if (selectedNote && selectedNoteData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              className="mb-8" 
              onClick={() => setSelectedNote(null)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Neural Notes
            </Button>

            <article className="space-y-8">
              <header className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                    {selectedNoteData.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedNoteData.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedNoteData.readTime}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedNoteData.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Media Section */}
                {(selectedNoteData.videoUrl || selectedNoteData.audioUrl) && (
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      {selectedNoteData.videoUrl && (
                        <div className="space-y-4 p-6">
                          <div className="flex items-center gap-2 text-primary">
                            <Youtube className="h-5 w-5" />
                            <span className="font-medium">Watch the discussion</span>
                          </div>
                          <div className="aspect-video">
                            <iframe
                              src={selectedNoteData.videoUrl}
                              title={`${selectedNoteData.title} - Video Discussion`}
                              className="w-full h-full rounded-lg"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                      
                      {selectedNoteData.audioUrl && !selectedNoteData.videoUrl && (
                        <div className="space-y-4 p-6">
                          <div className="flex items-center gap-2 text-primary">
                            <Volume2 className="h-5 w-5" />
                            <span className="font-medium">Listen to the audio version</span>
                          </div>
                          <audio controls className="w-full">
                            <source src={selectedNoteData.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div 
                  className="space-y-6"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedNoteData.content.replace(/\n/g, '<br>').replace(/---/g, '<hr class="my-8">') 
                  }} 
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Neural Notes</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Deep insights on AI, agentic workflows, and the future of intelligent systems. 
              Thoughts from the frontier of AI product engineering.
            </p>
          </div>

          <div className="space-y-8">
            {neuralNotes.map((note) => (
              <Card 
                key={note.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-[1.01] ${
                  note.featured ? 'ring-2 ring-primary/20' : ''
                }`}
                onClick={() => setSelectedNote(note.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-2xl">{note.title}</CardTitle>
                        {note.featured && (
                          <Badge variant="default">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-muted-foreground text-sm flex-wrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(note.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {note.readTime}
                        </div>
                        {note.videoUrl && (
                          <div className="flex items-center gap-2 text-primary">
                            <Youtube className="h-4 w-4" />
                            <span>Video available</span>
                          </div>
                        )}
                        {note.audioUrl && (
                          <div className="flex items-center gap-2 text-primary">
                            <Volume2 className="h-4 w-4" />
                            <span>Audio available</span>
                          </div>
                        )}
                      </div>

                      <CardDescription className="text-base leading-relaxed">
                        {note.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground italic">
                    "{note.excerpt}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6">
              More neural notes coming soon. Subscribe to stay updated on the latest insights.
            </p>
            <Button asChild variant="outline" size="lg">
              <a href="mailto:david@davidasaf.com">
                Subscribe for Updates
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNotes;