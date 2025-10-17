import { beforeEach, describe, expect, it, vi } from "vitest";
import * as contentModule from "@/lib/content";
import { mockProjects } from "@/test/fixtures/content";
import { render, screen, waitFor } from "@/test/test-utils";
import ProjectShowcase from "./ProjectShowcase";

// Mock the content module
vi.mock("@/lib/content", async () => {
  const actual = await vi.importActual("@/lib/content");
  return {
    ...actual,
    loadProjects: vi.fn(),
    getPrimaryMedia: vi.fn(() => ({ url: "", type: null })),
  };
});

// Mock the analytics module
vi.mock("@/lib/analytics", () => ({
  captureEvent: vi.fn(),
  useObserveElementsOnce: vi.fn(),
  ANALYTICS_EVENTS: {
    PROJECT_CARD_VIEWED: "project_card_viewed",
    PROJECT_CARD_CLICKED: "project_card_clicked",
    PROJECT_EXTERNAL_CLICKED: "project_external_clicked",
  },
}));

describe("ProjectShowcase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    vi.mocked(contentModule.loadProjects).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );
    render(<ProjectShowcase />);
    expect(screen.getByText(/loading projects/i)).toBeInTheDocument();
  });

  it("renders project cards after loading", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      expect(screen.getByText("AI Chatbot Platform")).toBeInTheDocument();
    });

    expect(screen.getByText("Data Visualization Tool")).toBeInTheDocument();
  });

  it("displays project title and description correctly", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      expect(screen.getByText("AI Chatbot Platform")).toBeInTheDocument();
    });

    expect(
      screen.getByText("An intelligent chatbot powered by machine learning"),
    ).toBeInTheDocument();
  });

  it("displays project tags correctly", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      expect(screen.getByText("AI")).toBeInTheDocument();
    });

    expect(screen.getByText("Machine Learning")).toBeInTheDocument();
    expect(screen.getByText("NLP")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("shows Code button when GitHub URL is provided", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      const codeLinks = screen.getAllByRole("link", { name: /code/i });
      expect(codeLinks.length).toBeGreaterThan(0);
      expect(codeLinks[0]).toHaveAttribute("href", "https://github.com/user/ai-chatbot");
    });
  });

  it("shows Demo button when demo URL is provided", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      const demoLinks = screen.getAllByRole("link", { name: /demo/i });
      expect(demoLinks.length).toBeGreaterThan(0);
      expect(demoLinks[0]).toHaveAttribute("href", "https://demo.example.com/ai-chatbot");
    });
  });

  it("displays featured badge for featured projects", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });
  });

  it("renders card as clickable with correct link", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      const links = screen.getAllByRole("link");
      const projectLink = links.find(
        (link) => link.getAttribute("href") === "/projects/ai-chatbot",
      );
      expect(projectLink).toBeInTheDocument();
    });
  });

  it("handles projects without GitHub or demo links", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue([mockProjects[2]]);

    render(<ProjectShowcase />);

    await waitFor(() => {
      expect(screen.getByText("Minimal Project")).toBeInTheDocument();
    });

    expect(screen.queryByRole("link", { name: /code/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /demo/i })).not.toBeInTheDocument();
  });

  it("renders View All Projects button", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      const viewAllLink = screen.getByRole("link", { name: /view all projects/i });
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink).toHaveAttribute("href", "/projects");
    });
  });

  it("limits to 4 projects in showcase", async () => {
    const manyProjects = [...mockProjects, ...mockProjects, ...mockProjects];
    vi.mocked(contentModule.loadProjects).mockResolvedValue(manyProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      // Should only render first 4 projects
      const projectCards = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href")?.startsWith("/projects/"));
      // Each project has multiple links (card, github, demo), so we check that we don't have more than 4 unique project slugs
      const uniqueProjects = new Set(
        projectCards.map((link) => link.getAttribute("href")?.split("/")[2]).filter(Boolean),
      );
      expect(uniqueProjects.size).toBeLessThanOrEqual(4);
    });
  });

  it("handles errors gracefully", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(contentModule.loadProjects).mockRejectedValue(new Error("Failed to load"));

    render(<ProjectShowcase />);

    await waitFor(() => {
      // Should not show loading state anymore
      expect(screen.queryByText(/loading projects/i)).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("external links open in new tab", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<ProjectShowcase />);

    await waitFor(() => {
      const codeLinks = screen.getAllByRole("link", { name: /code/i });
      expect(codeLinks[0]).toHaveAttribute("target", "_blank");
      expect(codeLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("shows +N more badge when project has more than 4 tags", async () => {
    const projectWithManyTags = {
      ...mockProjects[0],
      meta: {
        ...mockProjects[0].meta,
        tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
      },
    };
    vi.mocked(contentModule.loadProjects).mockResolvedValue([projectWithManyTags]);

    render(<ProjectShowcase />);

    await waitFor(() => {
      expect(screen.getByText("+2 more")).toBeInTheDocument();
    });
  });
});
