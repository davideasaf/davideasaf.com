import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import Breadcrumb from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders home icon link", () => {
    render(<Breadcrumb items={[]} />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders breadcrumb items correctly", () => {
    const items = [{ label: "Projects", href: "/projects" }, { label: "My Project" }];
    render(<Breadcrumb items={items} />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("My Project")).toBeInTheDocument();
  });

  it("renders clickable breadcrumb items with href", () => {
    const items = [{ label: "Projects", href: "/projects" }, { label: "My Project" }];
    render(<Breadcrumb items={items} />);

    const projectsLink = screen.getByRole("link", { name: "Projects" });
    expect(projectsLink).toHaveAttribute("href", "/projects");
  });

  it("renders last breadcrumb item as non-clickable", () => {
    const items = [{ label: "Projects", href: "/projects" }, { label: "Current Project" }];
    render(<Breadcrumb items={items} />);

    // Last item should not be a link
    expect(screen.queryByRole("link", { name: "Current Project" })).not.toBeInTheDocument();
    expect(screen.getByText("Current Project")).toBeInTheDocument();
  });

  it("renders separators between items", () => {
    const items = [{ label: "Projects", href: "/projects" }, { label: "My Project" }];
    const { container } = render(<Breadcrumb items={items} />);

    // Check for ChevronRight icons (separators)
    const separators = container.querySelectorAll("svg");
    // At least 2 separators (one after home, one after first item)
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });

  it("handles deep navigation paths", () => {
    const items = [
      { label: "Projects", href: "/projects" },
      { label: "AI Projects", href: "/projects/ai" },
      { label: "Machine Learning", href: "/projects/ai/ml" },
      { label: "Current Project" },
    ];
    render(<Breadcrumb items={items} />);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("AI Projects")).toBeInTheDocument();
    expect(screen.getByText("Machine Learning")).toBeInTheDocument();
    expect(screen.getByText("Current Project")).toBeInTheDocument();
  });

  it("scrolls to top when home link is clicked", async () => {
    const user = userEvent.setup();
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    render(<Breadcrumb items={[{ label: "Test" }]} />);
    const homeLink = screen.getByRole("link", { name: /home/i });

    await user.click(homeLink);

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    scrollToSpy.mockRestore();
  });

  it("has correct ARIA label", () => {
    render(<Breadcrumb items={[{ label: "Test" }]} />);
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
  });

  it("middle breadcrumb items with href are clickable", () => {
    const items = [
      { label: "Level 1", href: "/level1" },
      { label: "Level 2", href: "/level2" },
      { label: "Level 3" },
    ];
    render(<Breadcrumb items={items} />);

    // Both first and second items should be clickable
    expect(screen.getByRole("link", { name: "Level 1" })).toHaveAttribute("href", "/level1");
    expect(screen.getByRole("link", { name: "Level 2" })).toHaveAttribute("href", "/level2");
  });
});
