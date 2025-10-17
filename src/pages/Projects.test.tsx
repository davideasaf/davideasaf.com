import { beforeEach, describe, expect, it, vi } from "vitest";
import * as contentModule from "@/lib/content";
import { mockProjects } from "@/test/fixtures/content";
import { render, screen, waitFor } from "@/test/test-utils";
import Projects from "./Projects";

// Mock the content module
vi.mock("@/lib/content", async () => {
  const actual = await vi.importActual("@/lib/content");
  return {
    ...actual,
    loadProjects: vi.fn(),
  };
});

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  captureEvent: vi.fn(),
  useObserveElementsOnce: vi.fn(),
  ANALYTICS_EVENTS: {
    PROJECT_LIST_LOAD_FAILED: "project_list_load_failed",
    PROJECT_CARD_VIEWED: "project_card_viewed",
    PROJECT_CARD_CLICKED: "project_card_clicked",
    PROJECT_EXTERNAL_CLICKED: "project_external_clicked",
    MEDIA_RENDER_FAILED: "media_render_failed",
  },
}));

describe("Projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    vi.mocked(contentModule.loadProjects).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(<Projects />);

    expect(screen.getByText(/loading projects/i)).toBeInTheDocument();
  });

  it("renders all projects after loading", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("AI Chatbot Platform")).toBeInTheDocument();
    });

    expect(screen.getByText("Data Visualization Tool")).toBeInTheDocument();
    expect(screen.getByText("Minimal Project")).toBeInTheDocument();
  });

  it("displays featured projects with featured badge", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("Featured")).toBeInTheDocument();
    });
  });

  it("displays project descriptions", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      expect(
        screen.getByText("An intelligent chatbot powered by machine learning"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Interactive data visualization dashboard")).toBeInTheDocument();
  });

  it("displays project tags", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("AI")).toBeInTheDocument();
    });

    expect(screen.getByText("Machine Learning")).toBeInTheDocument();
    expect(screen.getByText("NLP")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Data Science")).toBeInTheDocument();
    expect(screen.getByText("D3.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("shows Code button when GitHub URL is provided", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      const codeLinks = screen.getAllByRole("link", { name: /code/i });
      expect(codeLinks.length).toBeGreaterThan(0);
      expect(codeLinks[0]).toHaveAttribute("href", "https://github.com/user/ai-chatbot");
    });
  });

  it("shows Demo button when demo URL is provided", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      const demoLinks = screen.getAllByRole("link", { name: /demo/i });
      expect(demoLinks.length).toBeGreaterThan(0);
      expect(demoLinks[0]).toHaveAttribute("href", "https://demo.example.com/ai-chatbot");
    });
  });

  it("hides Code button when no GitHub URL", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue([mockProjects[2]]);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("Minimal Project")).toBeInTheDocument();
    });

    expect(screen.queryByRole("link", { name: /code/i })).not.toBeInTheDocument();
  });

  it("hides Demo button when no demo URL", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue([mockProjects[2]]);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("Minimal Project")).toBeInTheDocument();
    });

    expect(screen.queryByRole("link", { name: /demo/i })).not.toBeInTheDocument();
  });

  it("project cards are clickable with correct links", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      const links = screen.getAllByRole("link");
      const projectLink = links.find(
        (link) => link.getAttribute("href") === "/projects/ai-chatbot",
      );
      expect(projectLink).toBeInTheDocument();
    });
  });

  it("displays project dates", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText(/January 15, 2024/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/February 20, 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/March 10, 2024/i)).toBeInTheDocument();
  });

  it("displays error state on load failure", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(contentModule.loadProjects).mockRejectedValue(new Error("Failed to load"));

    render(<Projects />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /We couldn't load the projects portfolio right now. Please refresh the page or try again in a moment./i,
        ),
      ).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("shows no projects message when list is empty", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue([]);

    render(<Projects />);

    await waitFor(() => {
      expect(
        screen.getByText(/No projects available just yet. Check back soon for new updates!/i),
      ).toBeInTheDocument();
    });
  });

  it("renders page header and description", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    // The heading has "My Projects" with Projects in a gradient span
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(
        /A collection of AI and machine learning projects showcasing innovative solutions/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders View All Projects on GitHub button", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      const githubLink = screen.getByRole("link", { name: /view all projects on github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/davideasaf");
      expect(githubLink).toHaveAttribute("target", "_blank");
    });
  });

  it("external links open in new tab with security attributes", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    render(<Projects />);

    await waitFor(() => {
      const codeLinks = screen.getAllByRole("link", { name: /code/i });
      expect(codeLinks[0]).toHaveAttribute("target", "_blank");
      expect(codeLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("displays +N more badge when project has more than 4 tags", async () => {
    const projectWithManyTags = {
      ...mockProjects[0],
      meta: {
        ...mockProjects[0].meta,
        tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
      },
    };
    vi.mocked(contentModule.loadProjects).mockResolvedValue([projectWithManyTags]);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("+2 more")).toBeInTheDocument();
    });
  });

  it("shows only first 4 tags when project has many tags", async () => {
    const projectWithManyTags = {
      ...mockProjects[0],
      meta: {
        ...mockProjects[0].meta,
        tags: ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6"],
      },
    };
    vi.mocked(contentModule.loadProjects).mockResolvedValue([projectWithManyTags]);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("Tag1")).toBeInTheDocument();
      expect(screen.getByText("Tag2")).toBeInTheDocument();
      expect(screen.getByText("Tag3")).toBeInTheDocument();
      expect(screen.getByText("Tag4")).toBeInTheDocument();
      expect(screen.queryByText("Tag5")).not.toBeInTheDocument();
      expect(screen.queryByText("Tag6")).not.toBeInTheDocument();
    });
  });

  it("renders grid layout correctly", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue(mockProjects);

    const { container } = render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("AI Chatbot Platform")).toBeInTheDocument();
    });

    // Check that the grid container exists with proper classes
    const gridContainer = container.querySelector('[class*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });

  it("project cards have featured ring styling", async () => {
    vi.mocked(contentModule.loadProjects).mockResolvedValue([mockProjects[0]]);

    const { container } = render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("AI Chatbot Platform")).toBeInTheDocument();
    });

    // Featured projects have ring styling
    const cards = container.querySelectorAll('[class*="ring-"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it("handles projects with video URLs", async () => {
    const projectWithVideo = {
      ...mockProjects[0],
      meta: {
        ...mockProjects[0].meta,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoTitle: "Project Demo",
      },
    };
    vi.mocked(contentModule.loadProjects).mockResolvedValue([projectWithVideo]);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("AI Chatbot Platform")).toBeInTheDocument();
    });

    // MediaDisplay component should render the video
    expect(screen.getByText("AI Chatbot Platform")).toBeInTheDocument();
  });
});
