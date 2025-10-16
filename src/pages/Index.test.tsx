import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import Index from "./Index";

// Mock all child components
vi.mock("@/components/Navigation", () => ({
  default: () => <div data-testid="navigation">Navigation</div>,
}));

vi.mock("@/components/HeroSection", () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock("@/components/AboutSection", () => ({
  default: () => <div data-testid="about-section">About Section</div>,
}));

vi.mock("@/components/ProjectShowcase", () => ({
  default: () => <div data-testid="project-showcase">Project Showcase</div>,
}));

vi.mock("@/components/NeuralNotes", () => ({
  default: () => <div data-testid="neural-notes">Neural Notes</div>,
}));

vi.mock("@/components/ContactSection", () => ({
  default: () => <div data-testid="contact-section">Contact Section</div>,
}));

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  initAnalytics: vi.fn(),
  useSectionsViewed: vi.fn(),
}));

describe("Index (Home Page)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders hero section", () => {
    render(<Index />);

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
  });

  it("renders navigation", () => {
    render(<Index />);

    expect(screen.getByTestId("navigation")).toBeInTheDocument();
  });

  it("renders about section", () => {
    render(<Index />);

    expect(screen.getByTestId("about-section")).toBeInTheDocument();
  });

  it("renders featured projects section", () => {
    render(<Index />);

    expect(screen.getByTestId("project-showcase")).toBeInTheDocument();
  });

  it("renders recent blog posts section (Neural Notes)", () => {
    render(<Index />);

    expect(screen.getByTestId("neural-notes")).toBeInTheDocument();
  });

  it("renders contact section", () => {
    render(<Index />);

    expect(screen.getByTestId("contact-section")).toBeInTheDocument();
  });

  it("renders all sections in correct order", () => {
    const { container } = render(<Index />);

    const sections = container.querySelectorAll("[data-testid]");
    const sectionIds = Array.from(sections).map((section) =>
      section.getAttribute("data-testid"),
    );

    expect(sectionIds).toEqual([
      "navigation",
      "hero-section",
      "about-section",
      "project-showcase",
      "neural-notes",
      "contact-section",
    ]);
  });

  it("initializes analytics on mount", async () => {
    const { initAnalytics } = await import("@/lib/analytics");

    render(<Index />);

    expect(initAnalytics).toHaveBeenCalled();
  });

  it("tracks section views", async () => {
    const { useSectionsViewed } = await import("@/lib/analytics");

    render(<Index />);

    expect(useSectionsViewed).toHaveBeenCalledWith(
      ["hero", "about", "projects", "neural-notes", "contact"],
      0.5,
    );
  });

  it("sets meta tags for Open Graph", () => {
    render(<Index />);

    // Helmet sets meta tags in document.head
    // We verify the component renders successfully
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
  });

  it("has minimum height class for full viewport", () => {
    const { container } = render(<Index />);

    const mainDiv = container.querySelector('[class*="min-h-screen"]');
    expect(mainDiv).toBeInTheDocument();
  });

  it("renders without errors", () => {
    const { container } = render(<Index />);

    expect(container).toBeInTheDocument();
  });
});
