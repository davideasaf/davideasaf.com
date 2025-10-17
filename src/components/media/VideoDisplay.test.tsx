import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { VideoDisplay } from "./VideoDisplay";

describe("VideoDisplay", () => {
  it("renders YouTube embed with valid URL", () => {
    const onError = vi.fn();
    render(
      <VideoDisplay
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        metaTitle="Test Video"
        onError={onError}
      />,
    );

    const iframe = screen.getByTitle("Test Video video");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(onError).not.toHaveBeenCalled();
  });

  it("uses custom title when provided", () => {
    const onError = vi.fn();
    render(
      <VideoDisplay
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Custom Title"
        metaTitle="Meta Title"
        onError={onError}
      />,
    );

    const iframe = screen.getByTitle("Custom Title");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("aria-label", "Custom Title video");
  });

  it("falls back to metaTitle when no custom title provided", () => {
    const onError = vi.fn();
    render(
      <VideoDisplay
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        metaTitle="Meta Title"
        onError={onError}
      />,
    );

    const iframe = screen.getByTitle("Meta Title video");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("aria-label", "Embedded project video");
  });

  it("handles youtu.be short URLs", () => {
    const onError = vi.fn();
    render(
      <VideoDisplay url="https://youtu.be/dQw4w9WgXcQ" metaTitle="Test Video" onError={onError} />,
    );

    const iframe = screen.getByTitle("Test Video video");
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("calls onError with invalid URL", () => {
    const onError = vi.fn();
    render(<VideoDisplay url="https://invalid-url.com" metaTitle="Test Video" onError={onError} />);

    expect(onError).toHaveBeenCalled();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("does not render iframe when URL is invalid", () => {
    const onError = vi.fn();
    const { container } = render(
      <VideoDisplay url="not-a-valid-url" metaTitle="Test Video" onError={onError} />,
    );

    expect(container.querySelector("iframe")).not.toBeInTheDocument();
  });

  it("has correct iframe attributes for accessibility", () => {
    const onError = vi.fn();
    render(
      <VideoDisplay
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        metaTitle="Test Video"
        onError={onError}
      />,
    );

    const iframe = screen.getByTitle("Test Video video");
    expect(iframe).toHaveAttribute("allowfullscreen");
    expect(iframe).toHaveAttribute("loading", "lazy");
    expect(iframe).toHaveAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    );
  });

  it("includes screen reader announcement for loaded video", () => {
    const onError = vi.fn();
    render(
      <VideoDisplay
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        metaTitle="Test Video"
        onError={onError}
      />,
    );

    const announcement = screen.getByText(/Embedded video for Test Video loaded successfully/i);
    expect(announcement).toHaveClass("sr-only");
    expect(announcement).toHaveAttribute("aria-live", "polite");
  });
});
