import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import NeuralNotes from "@/components/NeuralNotes";
import ProjectShowcase from "@/components/ProjectShowcase";
import { initAnalytics, useSectionsViewed } from "@/lib/analytics";

const Index = () => {
  useSectionsViewed(["hero", "about", "projects", "neural-notes", "contact"], 0.5);
  useEffect(() => {
    initAnalytics();
  }, []);
  return (
    <div className="min-h-screen">
      <Helmet>
        <meta property="og:image" content="/assets/hero-bg-1200.jpg" />
        <meta name="twitter:image" content="/assets/hero-bg-1200.jpg" />
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
