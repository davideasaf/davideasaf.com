import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import Index from "@/pages/Index";
import NeuralNotes from "@/pages/NeuralNotes";
import Projects from "@/pages/Projects";

// Keep detail routes lazy and prefetch via hover/IO
const Project = lazy(() => import("./pages/Project"));
const NeuralNote = lazy(() => import("./pages/NeuralNote"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Keep fallback minimal to avoid blocking paint
const PageLoader = () => null;

// Component to handle scrolling to hash targets using the custom hook
const ScrollToHash = () => {
  useScrollToHash();
  return null;
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<Project />} />
              <Route path="/neural-notes" element={<NeuralNotes />} />
              <Route path="/neural-notes/:slug" element={<NeuralNote />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
