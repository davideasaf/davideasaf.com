import React from "react";
import ReactDOMServer from "react-dom/server";
import { calculateReadingTime } from "./config";

// Synchronous, lightweight estimator to avoid awaiting config during render.
// Keep simple and stable for UI; use for list pages and precomputed meta.
const WORDS_PER_MINUTE_SYNC = 200;

export function readingTimeFromText(text: string): string {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE_SYNC));
  return `${minutes} min read`;
}

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
  // Use the same normalization and configuration as the server-side calculation
  const html = (element as HTMLElement).innerHTML || element.textContent || "";
  return calculateReadingTime(html);
}
