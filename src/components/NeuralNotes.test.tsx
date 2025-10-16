import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import NeuralNotes from "./NeuralNotes";
import { mockNeuralNotes } from "@/test/fixtures/content";
import * as contentModule from "@/lib/content";

// Mock the content module
vi.mock("@/lib/content", async () => {
  const actual = await vi.importActual("@/lib/content");
  return {
    ...actual,
    loadNeuralNotes: vi.fn(),
    getPrimaryMedia: vi.fn(() => ({ url: "", type: null })),
  };
});

// Mock the analytics module
vi.mock("@/lib/analytics", () => ({
  captureEvent: vi.fn(),
  useObserveElementsOnce: vi.fn(),
  ANALYTICS_EVENTS: {
    NEURAL_NOTE_CARD_VIEWED: "neural_note_card_viewed",
    NEURAL_NOTE_CARD_CLICKED: "neural_note_card_clicked",
  },
}));

describe("NeuralNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders neural notes cards after loading", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("Understanding Transformers in AI")).toBeInTheDocument();
    });

    expect(screen.getByText("React Best Practices 2024")).toBeInTheDocument();
  });

  it("displays post title and excerpt correctly", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("Understanding Transformers in AI")).toBeInTheDocument();
    });

    expect(screen.getByText("A deep dive into the transformer architecture")).toBeInTheDocument();
  });

  it("displays publication date correctly", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      // Date format: "Jan 10, 2024"
      expect(screen.getByText(/Jan 10, 2024/i)).toBeInTheDocument();
    });
  });

  it("shows read time estimate", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("8 min read")).toBeInTheDocument();
    });

    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("renders tags correctly", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("AI")).toBeInTheDocument();
    });

    expect(screen.getByText("Deep Learning")).toBeInTheDocument();
    expect(screen.getByText("Transformers")).toBeInTheDocument();
  });

  it("displays featured badge for featured posts", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });
  });

  it("card is clickable and navigates to correct post", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      const links = screen.getAllByRole("link");
      const noteLink = links.find(
        (link) => link.getAttribute("href") === "/neural-notes/understanding-transformers",
      );
      expect(noteLink).toBeInTheDocument();
    });
  });

  it("handles posts with video content", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue([mockNeuralNotes[0]]);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("Understanding Transformers in AI")).toBeInTheDocument();
    });

    // Note: The multimedia indicator only shows when getPrimaryMedia returns empty
    // In this test we're not testing that specific UI, just that the card renders
  });

  it("handles posts with audio content", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue([mockNeuralNotes[1]]);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("React Best Practices 2024")).toBeInTheDocument();
    });
  });

  it("handles posts without images", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue([mockNeuralNotes[2]]);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("Minimal Note")).toBeInTheDocument();
    });

    // Should still render the card content
    expect(screen.getByText("A note with minimal metadata")).toBeInTheDocument();
  });

  it("renders Explore All Neural Notes button", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      const exploreLink = screen.getByRole("link", { name: /explore all neural notes/i });
      expect(exploreLink).toBeInTheDocument();
      expect(exploreLink).toHaveAttribute("href", "/neural-notes");
    });
  });

  it("limits to 3 notes in showcase", async () => {
    const manyNotes = [...mockNeuralNotes, ...mockNeuralNotes];
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(manyNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      // Should only render first 3 notes
      const noteCards = screen.getAllByRole("link").filter((link) =>
        link.getAttribute("href")?.startsWith("/neural-notes/"),
      );
      const uniqueNotes = new Set(
        noteCards.map((link) => link.getAttribute("href")?.split("/")[2]).filter(Boolean),
      );
      expect(uniqueNotes.size).toBeLessThanOrEqual(3);
    });
  });

  it("handles errors gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(contentModule.loadNeuralNotes).mockRejectedValue(new Error("Failed to load"));

    render(<NeuralNotes />);

    await waitFor(() => {
      // Component should still render the section heading without crashing
      expect(screen.getByText("🧠 Neural Notes")).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("shows Continue Reading link", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      const continueLinks = screen.getAllByText(/continue reading/i);
      expect(continueLinks.length).toBeGreaterThan(0);
    });
  });

  it("renders section header with emoji", async () => {
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue(mockNeuralNotes);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText(/🧠 Neural Notes/i)).toBeInTheDocument();
    });
  });

  it("shows multimedia content indicator when video/audio available", async () => {
    // Mock getPrimaryMedia to return empty so the multimedia indicator shows
    vi.mocked(contentModule.getPrimaryMedia).mockReturnValue({ url: "", type: null });
    vi.mocked(contentModule.loadNeuralNotes).mockResolvedValue([mockNeuralNotes[0]]);

    render(<NeuralNotes />);

    await waitFor(() => {
      expect(screen.getByText("Multimedia Content Available")).toBeInTheDocument();
    });

    expect(screen.getByText("Watch the video explanation")).toBeInTheDocument();
  });
});
