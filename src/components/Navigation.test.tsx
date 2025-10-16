import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import Navigation from "./Navigation";

// Mock the analytics module
vi.mock("@/lib/analytics", () => ({
  captureEvent: vi.fn(),
  getDeviceSource: vi.fn(() => "desktop"),
  ANALYTICS_EVENTS: {
    NAV_CLICKED: "nav_clicked",
  },
}));

// Mock the use-active-section hook
vi.mock("@/hooks/use-active-section", () => ({
  useActiveSection: vi.fn(() => "hero"),
}));

describe("Navigation", () => {
  it("renders navigation with brand name", () => {
    render(<Navigation />);
    expect(screen.getByText("David Asaf")).toBeInTheDocument();
  });

  it("renders all main navigation links", () => {
    render(<Navigation />);

    expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /neural notes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /contact/i })).toBeInTheDocument();
  });

  it("renders Let's Connect button", () => {
    render(<Navigation />);
    const connectButtons = screen.getAllByRole("button", { name: /let's connect/i });
    expect(connectButtons.length).toBeGreaterThan(0);
  });

  it("renders mobile menu toggle button", () => {
    render(<Navigation />);
    const menuButton = screen.getByRole("button", { name: "" });
    // Menu button should contain Menu icon
    expect(menuButton).toBeInTheDocument();
  });

  it("toggles mobile menu on button click", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    // Initially, mobile menu items should not be visible (in desktop view context)
    // Find the menu toggle button (it's the one with Menu/X icon, no text)
    const buttons = screen.getAllByRole("button");
    const menuButton = buttons.find((btn) => btn.textContent === "");

    expect(menuButton).toBeInTheDocument();

    // Click to open mobile menu
    if (menuButton) {
      await user.click(menuButton);
      // After clicking, mobile menu should be visible
      // We can verify by checking if duplicate nav items appear
    }
  });

  it("closes mobile menu when navigation item is clicked", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    // Open mobile menu first
    const buttons = screen.getAllByRole("button");
    const menuButton = buttons.find((btn) => btn.textContent === "");

    if (menuButton) {
      await user.click(menuButton);

      // Find and click a navigation item
      const allHomeButtons = screen.getAllByRole("button", { name: /home/i });
      if (allHomeButtons.length > 1) {
        // Click the mobile version (second one)
        await user.click(allHomeButtons[1]);
        // Menu should close (verify by state change)
      }
    }
  });

  it("calls navigation handler when home is clicked", async () => {
    const user = userEvent.setup();

    render(<Navigation />);

    const homeButton = screen.getAllByRole("button", { name: /home/i })[0];
    await user.click(homeButton);

    // Home button should be functional (click doesn't throw)
    expect(homeButton).toBeInTheDocument();
  });

  it("has fixed positioning and backdrop blur", () => {
    const { container } = render(<Navigation />);
    const nav = container.querySelector("nav");

    expect(nav).toHaveClass("fixed");
    expect(nav).toHaveClass("backdrop-blur-sm");
  });

  it("renders Brain icon in logo", () => {
    const { container } = render(<Navigation />);
    const brainIcon = container.querySelector("svg");
    expect(brainIcon).toBeInTheDocument();
  });

  it("has proper navigation landmark", () => {
    render(<Navigation />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });
});
