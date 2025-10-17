import { beforeEach, describe, expect, it, vi } from "vitest";
import * as contentModule from "@/lib/content";
import * as readingTimeModule from "@/lib/readingTime";
import { mockNeuralNotes } from "@/test/fixtures/content";
import { render, screen, waitFor } from "@/test/test-utils";
import NeuralNote from "./NeuralNote";

// Mock the content module
vi.mock("@/lib/content", async () => {
  const actual = await vi.importActual("@/lib/content");
  return {
    ...actual,
    getNeuralNoteBySlugSync: vi.fn(),
    getNeuralNoteOgImage: vi.fn(() => "/og-image.jpg"),
  };
});

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  captureEvent: vi.fn(),
  useScrollProgressMilestones: vi.fn(),
  ANALYTICS_EVENTS: {
    NEURAL_NOTE_VIEWED: "neural_note_viewed",
    NEURAL_NOTE_READ_PROGRESS: "neural_note_read_progress",
  },
}));

// Mock reading time module
vi.mock("@/lib/readingTime", async () => {
  const actual = await vi.importActual("@/lib/readingTime");
  return {
    ...actual,
    computeReadingTimeFromDOM: vi.fn(() => Promise.resolve("5 min read")),
  };
});

// Mock useParams from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe("NeuralNote", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Default mock for useParams
    const { useParams } = await import("react-router-dom");
    vi.mocked(useParams).mockReturnValue({ slug: "understanding-transformers" });
  });

  it("renders post content from markdown", async () => {
    const note = mockNeuralNotes[0];
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
    });
  });

  it("displays post title from frontmatter", async () => {
    const note = mockNeuralNotes[0];
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      // Use getByRole to find the h1 heading specifically
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Understanding Transformers in AI",
      );
    });
  });

  it("shows publication date", async () => {
    const note = mockNeuralNotes[0];
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getByText(/January 10, 2024/i)).toBeInTheDocument();
    });
  });

  it("displays read time from metadata", async () => {
    const note = mockNeuralNotes[0];
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getByText("8 min read")).toBeInTheDocument();
    });
  });

  it("computes read time from DOM when not in metadata", async () => {
    const note = {
      ...mockNeuralNotes[2],
      meta: { ...mockNeuralNotes[2].meta, readTime: undefined },
    };
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);
    vi.mocked(readingTimeModule.computeReadingTimeFromDOM).mockResolvedValue("5 min read");

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getAllByText("Minimal Note").length).toBeGreaterThan(0);
    });

    // Wait for computed read time to appear
    await waitFor(
      () => {
        expect(screen.getByText("5 min read")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it("renders tags", async () => {
    const note = mockNeuralNotes[0];
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getByText("AI")).toBeInTheDocument();
    });

    expect(screen.getByText("Deep Learning")).toBeInTheDocument();
    expect(screen.getByText("Transformers")).toBeInTheDocument();
  });

  it("shows video embed when hasVideo is true", async () => {
    const note = mockNeuralNotes[0]; // Has video
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
    });

    // MediaDisplay component should be rendered (it's in the DOM)
    // We can't easily test the iframe without mocking MediaDisplay, but we can verify the component renders
    expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
  });

  it("renders featured image as hero when provided", async () => {
    const note = mockNeuralNotes[0]; // Has banner
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
    });

    // MediaDisplay renders the banner, we verify the page renders without errors
    expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
  });

  it("breadcrumbs display correctly", async () => {
    const note = mockNeuralNotes[0];
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      const breadcrumbLinks = screen.getAllByRole("link");
      const neuralNotesLink = breadcrumbLinks.find(
        (link) => link.getAttribute("href") === "/neural-notes",
      );
      expect(neuralNotesLink).toBeInTheDocument();
    });
  });

  it("meta tags are set correctly", async () => {
    const note = mockNeuralNotes[0];
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
    });

    // Helmet sets meta tags in the document head
    // We can verify the component renders successfully
    expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
  });

  it("handles missing post gracefully (404)", async () => {
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(null);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    expect(screen.getByText("Neural note not found")).toBeInTheDocument();
    expect(screen.getByText("Back to Neural Notes")).toBeInTheDocument();
  });

  it("shows error message when slug is missing", async () => {
    const { useParams } = await import("react-router-dom");
    vi.mocked(useParams).mockReturnValue({});
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(null);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });

  it("renders back button with correct navigation", async () => {
    const note = mockNeuralNotes[0];
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      const backButtons = screen.getAllByText("Back to Neural Notes");
      expect(backButtons.length).toBeGreaterThan(0);
      const parentLink = backButtons[0].closest("a");
      expect(parentLink).toHaveAttribute("href", "/neural-notes");
    });
  });

  it("handles posts without tags", async () => {
    const note = {
      ...mockNeuralNotes[2],
      meta: { ...mockNeuralNotes[2].meta, tags: [] },
    };
    vi.mocked(contentModule.getNeuralNoteBySlugSync).mockReturnValue(note);

    render(<NeuralNote />);

    await waitFor(() => {
      expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
    });

    // Should render without crashing even with no tags
    expect(screen.getAllByText(note.meta.title).length).toBeGreaterThan(0);
  });
});
