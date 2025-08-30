import React from "react";
import ReactDOMServer from "react-dom/server";
import { calculateReadingTime, loadConfig } from "./config";

// Utility: remove YAML frontmatter if present
export function stripFrontMatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\s*/, "");
}

// Source of truth: compute reading-time from raw MDX (preferred) or by rendering the component
export async function computeReadingTimeFromRawOrComponent(
  raw: string | undefined,
  Component: React.ComponentType,
): Promise<string> {
  let body = typeof raw === "string" && raw.trim().length > 0 ? stripFrontMatter(raw) : "";

  if (body.trim().length === 0) {
    try {
      const html = ReactDOMServer.renderToStaticMarkup(React.createElement(Component));
      body = html;
    } catch {
      // ignore
    }
  }

  return calculateReadingTime(body);
}

// Browser-only fallback: compute reading time from an already-rendered element (e.g., on detail page)
export async function computeReadingTimeFromDOM(element: Element): Promise<string> {
  const cfg = await loadConfig();
  const wpm = Math.max(1, cfg.content.reading.wordsPerMinute || 200);
  const text = element.textContent || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return `${minutes} min read`;
}


