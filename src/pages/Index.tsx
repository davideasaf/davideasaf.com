import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import NeuralNotes from "@/components/NeuralNotes";
import ProjectShowcase from "@/components/ProjectShowcase";
import { useSectionsViewed } from "@/lib/analytics";

const Index = () => {
  useSectionsViewed(["hero", "about", "projects", "neural-notes", "contact"], 0.5);
  return (
    <div className="min-h-screen">
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
