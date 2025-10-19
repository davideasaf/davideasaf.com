import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import NeuralNotes from "@/components/NeuralNotes";
import ProjectShowcase from "@/components/ProjectShowcase";
import { initAnalytics, useSectionsViewed } from "@/lib/analytics";
import { SITE_NAME, SITE_URL, getAbsoluteUrl } from "@/lib/config";

const Index = () => {
  useSectionsViewed(["hero", "about", "projects", "neural-notes", "contact"], 0.5);
  useEffect(() => {
    initAnalytics();
  }, []);
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{SITE_NAME}</title>
        <meta
          name="description"
          content="AI Product Engineer specializing in generative AI, agentic workflows, and intelligent automation. Portfolio and insights from Charlotte, NC."
        />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={SITE_NAME} />
        <meta
          property="og:description"
          content="AI Product Engineer specializing in generative AI, agentic workflows, and intelligent automation."
        />
        <meta property="og:image" content={getAbsoluteUrl("/assets/hero-bg-1200.jpg")} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="David Asaf - AI Product Engineer" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_NAME} />
        <meta
          name="twitter:description"
          content="AI Product Engineer specializing in generative AI, agentic workflows, and intelligent automation."
        />
        <meta name="twitter:image" content={getAbsoluteUrl("/assets/hero-bg-1200.jpg")} />
        <meta name="twitter:image:alt" content="David Asaf - AI Product Engineer" />
      </Helmet>
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProjectShowcase />
      <NeuralNotes />
      <ContactSection />
    </div>
  );
};

export default Index;
