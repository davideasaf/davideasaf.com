import { Calendar, Github, Linkedin, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ANALYTICS_EVENTS, captureEvent } from "@/lib/analytics";

const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Quick questions or general inquiries",
    },
    {
      icon: MessageSquare,
      title: "Let's Chat",
      description: "Schedule a conversation about your ideas",
    },
    {
      icon: Calendar,
      title: "Consulting",
      description: "AI strategy & development projects",
    },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", url: "https://github.com/davideasaf" },
    { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/davideasaf/" },
  ];

  return (
    // biome-ignore lint/correctness/useUniqueElementIds: Page-level section rendered once per page.
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Let's Build Something{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Amazing Together
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you have a project in mind, want to discuss AI opportunities, or just want to
            connect, I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-6 text-center lg:text-left">
                Here are a few reasons you might want to reach out:
              </h3>
              <div className="grid gap-6">
                {contactMethods.map((method) => (
                  <Card key={method.title} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <method.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{method.title}</h3>
                          <p className="text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Follow My Journey</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      captureEvent(ANALYTICS_EVENTS.SOCIAL_CLICKED, {
                        network: link.label.toLowerCase(),
                        page: "/",
                      })
                    }
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:border-primary hover:text-primary"
                    >
                      <link.icon className="h-5 w-5" />
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Send a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  {/* biome-ignore lint/correctness/useUniqueElementIds: Single form instance on page. */}
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {/* biome-ignore lint/correctness/useUniqueElementIds: Single form instance on page. */}
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                {/* biome-ignore lint/correctness/useUniqueElementIds: Single form instance on page. */}
                <Input id="subject" placeholder="What's this about?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                {/* biome-ignore lint/correctness/useUniqueElementIds: Single form instance on page. */}
                <Textarea
                  id="message"
                  placeholder="Whether it's a quick question, scheduling a chat, or discussing a project - I'd love to hear from you..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <Button
                className="w-full"
                variant="hero"
                size="lg"
                onClick={() =>
                  captureEvent(ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED, {
                    has_name: Boolean((document.getElementById("name") as HTMLInputElement)?.value),
                    has_email: Boolean(
                      (document.getElementById("email") as HTMLInputElement)?.value,
                    ),
                    has_subject: Boolean(
                      (document.getElementById("subject") as HTMLInputElement)?.value,
                    ),
                    has_message: Boolean(
                      (document.getElementById("message") as HTMLTextAreaElement)?.value,
                    ),
                  })
                }
              >
                <Mail className="mr-2 h-5 w-5" />
                Send Message
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                I typically respond within 24 hours. Looking forward to connecting!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
