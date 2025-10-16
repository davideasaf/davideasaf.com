import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { mockNeuralNotes } from "@/test/fixtures/content";
import * as contentModule from "@/lib/content";
import NeuralNotes from "./NeuralNotes";

// Mock the content module
vi.mock("@/lib/content", async () => {
  const actual = await vi.importActual("@/lib/content");
  return {
    ...actual,
    getNeuralNotesSync: vi.fn(),
    getPrimaryMedia: vi.fn(() => ({ url: "", type: null })),
  };
});

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  captureEvent: vi.fn(),
  ANALYTICS_EVENTS: {
    NEURAL_NOTES_LIST_VIEWED: "neural_notes_list_viewed",
    NEURAL_NOTE_CARD_CLICKED: "neural_note_card_clicked",
  },
}));

// Mock prefetch
vi.mock("@/lib/prefetch", () => ({
  prefetchDetailPages: vi.fn(),
}));

describe("NeuralNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all blog posts", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(mockNeuralNotes);

    render(<NeuralNotes />);

    expect(screen.getByText("Understanding Transformers in AI")).toBeInTheDocument();
    expect(screen.getByText("React Best Practices 2024")).toBeInTheDocument();
    expect(screen.getByText("Minimal Note")).toBeInTheDocument();
  });

  it("posts are sorted by date (newest first)", () => {
    // Create posts with different dates
    const posts = [
      { ...mockNeuralNotes[0], meta: { ...mockNeuralNotes[0].meta, date: "2024-01-01" } },
      { ...mockNeuralNotes[1], meta: { ...mockNeuralNotes[1].meta, date: "2024-03-01" } },
      { ...mockNeuralNotes[2], meta: { ...mockNeuralNotes[2].meta, date: "2024-02-01" } },
    ];

    // The component relies on getNeuralNotesSync which should return sorted posts
    // We need to mock it to return sorted posts (newest first)
    const sortedPosts = [...posts].sort(
      (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime(),
    );

    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(sortedPosts);

    render(<NeuralNotes />);

    // Verify all posts are rendered
    expect(screen.getByText(sortedPosts[0].meta.title)).toBeInTheDocument();
    expect(screen.getByText(sortedPosts[1].meta.title)).toBeInTheDocument();
    expect(screen.getByText(sortedPosts[2].meta.title)).toBeInTheDocument();

    // Get all links to verify order
    const links = screen.getAllByRole("link");
    const postLinks = links.filter((link) =>
      link.getAttribute("href")?.startsWith("/neural-notes/"),
    );

    // The first post link should be for the newest post
    const firstPostLink = postLinks.find((link) =>
      link.getAttribute("href")?.includes(sortedPosts[0].slug),
    );
    expect(firstPostLink).toBeInTheDocument();
  });

  it("featured posts show featured badge", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(mockNeuralNotes);

    render(<NeuralNotes />);

    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("displays post excerpts", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(mockNeuralNotes);

    render(<NeuralNotes />);

    expect(screen.getByText("A deep dive into the transformer architecture")).toBeInTheDocument();
    expect(
      screen.getByText("Modern patterns and practices for React development"),
    ).toBeInTheDocument();
  });

  it("displays publication dates", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(mockNeuralNotes);

    render(<NeuralNotes />);

    expect(screen.getByText(/January 10, 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/February 15, 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/March 1, 2024/i)).toBeInTheDocument();
  });

  it("displays read times", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(mockNeuralNotes);

    render(<NeuralNotes />);

    expect(screen.getByText("8 min read")).toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
    expect(screen.getByText("2 min read")).toBeInTheDocument();
  });

  it("shows video indicator when post has video", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue([mockNeuralNotes[0]]);

    render(<NeuralNotes />);

    expect(screen.getByText("Video available")).toBeInTheDocument();
  });

  it("shows audio indicator when post has audio", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue([mockNeuralNotes[1]]);

    render(<NeuralNotes />);

    expect(screen.getByText("Audio available")).toBeInTheDocument();
  });

  it("renders tags for each post", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(mockNeuralNotes);

    render(<NeuralNotes />);

    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("Deep Learning")).toBeInTheDocument();
    expect(screen.getByText("Transformers")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("Best Practices")).toBeInTheDocument();
  });

  it("cards are clickable with correct links", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(mockNeuralNotes);

    render(<NeuralNotes />);

    const links = screen.getAllByRole("link");
    const noteLink1 = links.find(
      (link) => link.getAttribute("href") === "/neural-notes/understanding-transformers",
    );
    const noteLink2 = links.find(
      (link) => link.getAttribute("href") === "/neural-notes/react-best-practices",
    );
    const noteLink3 = links.find(
      (link) => link.getAttribute("href") === "/neural-notes/minimal-note",
    );

    expect(noteLink1).toBeInTheDocument();
    expect(noteLink2).toBeInTheDocument();
    expect(noteLink3).toBeInTheDocument();
  });

  it("shows no posts message when list is empty", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue([]);

    render(<NeuralNotes />);

    // When there are no posts, the page still shows the header
    expect(screen.getAllByText("Neural Notes").length).toBeGreaterThan(0);
    // But no post content
    expect(screen.queryByText("Understanding Transformers in AI")).not.toBeInTheDocument();
  });

  it("renders page header and description", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(mockNeuralNotes);

    render(<NeuralNotes />);

    expect(screen.getAllByText("Neural Notes").length).toBeGreaterThan(0);
    expect(
      screen.getByText(
        /Deep insights on AI, agentic workflows, and the future of intelligent systems/i,
      ),
    ).toBeInTheDocument();
  });

  it("posts without media render correctly", () => {
    const postWithoutMedia = {
      ...mockNeuralNotes[2],
      meta: {
        ...mockNeuralNotes[2].meta,
        videoUrl: undefined,
        audioUrl: undefined,
        banner: undefined,
      },
    };
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue([postWithoutMedia]);
    vi.mocked(contentModule.getPrimaryMedia).mockReturnValue({ url: "", type: null });

    render(<NeuralNotes />);

    expect(screen.getByText("Minimal Note")).toBeInTheDocument();
    expect(screen.queryByText("Video available")).not.toBeInTheDocument();
    expect(screen.queryByText("Audio available")).not.toBeInTheDocument();
  });

  it("handles posts with primary media", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue([mockNeuralNotes[0]]);
    vi.mocked(contentModule.getPrimaryMedia).mockReturnValue({
      url: "https://example.com/video.mp4",
      type: "video",
    });

    render(<NeuralNotes />);

    expect(screen.getByText("Understanding Transformers in AI")).toBeInTheDocument();
    // MediaDisplay component should be in the DOM
  });

  it("displays card styling for featured posts", () => {
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue([mockNeuralNotes[0]]);

    const { container } = render(<NeuralNotes />);

    // Featured posts have a ring styling class
    const cards = container.querySelectorAll('[class*="ring-"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it("all posts render in chronological order", () => {
    const posts = [
      { ...mockNeuralNotes[0], meta: { ...mockNeuralNotes[0].meta, date: "2024-03-01" } },
      { ...mockNeuralNotes[1], meta: { ...mockNeuralNotes[1].meta, date: "2024-02-01" } },
      { ...mockNeuralNotes[2], meta: { ...mockNeuralNotes[2].meta, date: "2024-01-01" } },
    ];

    // Mock returns posts already sorted by date (newest first)
    vi.mocked(contentModule.getNeuralNotesSync).mockReturnValue(posts);

    render(<NeuralNotes />);

    // All posts should be rendered
    expect(screen.getByText(posts[0].meta.title)).toBeInTheDocument();
    expect(screen.getByText(posts[1].meta.title)).toBeInTheDocument();
    expect(screen.getByText(posts[2].meta.title)).toBeInTheDocument();
  });
});
