import { Calendar, Github, Linkedin, Mail, MessageSquare, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Drop me a line anytime",
      value: "david@davidasaf.dev",
      action: "Send Email",
    },
    {
      icon: MessageSquare,
      title: "Let's Chat",
      description: "Schedule a conversation",
      value: "30-minute call",
      action: "Book Call",
    },
    {
      icon: Calendar,
      title: "Consulting",
      description: "AI strategy & development",
      value: "Available for projects",
      action: "Discuss Project",
    },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", url: "https://github.com/davideasaf" },
    { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/davideasaf/" },
  ];

  return (
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
            <div className="grid gap-6">
              {contactMethods.map((method) => (
                <Card
                  key={`${method.title}:${method.action}`}
                  className="group hover:shadow-elegant transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                        <method.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                        <p className="text-sm font-medium text-primary">{method.value}</p>
                      </div>
                      <Button variant="outline" size="sm" className="group-hover:border-primary">
                        {method.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Follow My Journey</h3>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
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
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this about?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project or idea..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <Button className="w-full" variant="hero" size="lg">
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
