import posthog from "posthog-js";
import { useEffect } from "react";

export const ANALYTICS_EVENTS = {
  SECTION_VIEWED: "section_viewed",
  NAV_CLICKED: "nav_clicked",
  CTA_CLICKED: "cta_clicked",
  PROJECT_CARD_VIEWED: "project_card_viewed",
  PROJECT_CARD_CLICKED: "project_card_clicked",
  PROJECT_EXTERNAL_CLICKED: "project_external_clicked",
  PROJECT_DETAIL_VIEWED: "project_detail_viewed",
  PROJECT_DETAIL_EXTERNAL_CLICKED: "project_detail_external_clicked",
  NEURAL_NOTES_LIST_VIEWED: "neural_notes_list_viewed",
  NEURAL_NOTE_CARD_VIEWED: "neural_note_card_viewed",
  NEURAL_NOTE_CARD_CLICKED: "neural_note_card_clicked",
  NEURAL_NOTE_VIEWED: "neural_note_viewed",
  NEURAL_NOTE_MEDIA_INTERACTED: "neural_note_media_interacted",
  NEURAL_NOTE_READ_PROGRESS: "neural_note_read_progress",
  SOCIAL_CLICKED: "social_clicked",
  CONTACT_METHOD_CLICKED: "contact_method_clicked",
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS] | string;

export function captureEvent(name: AnalyticsEventName, props?: Record<string, unknown>): void {
  try {
    if (typeof window === "undefined") return;
    if (!posthog || typeof posthog.capture !== "function") return;
    const merged = {
      page: window.location?.pathname,
      ...props,
    };
    posthog.capture(name, merged);
  } catch {
    // noop
  }
}

export function getDeviceSource(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

export function useSectionsViewed(sectionIds: string[], threshold = 0.5): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const id = el.id;
          if (!id || seen.has(id)) continue;
          if (entry.intersectionRatio >= threshold) {
            seen.add(id);
            captureEvent(ANALYTICS_EVENTS.SECTION_VIEWED, {
              section_id: id,
              percent_visible: Math.round(entry.intersectionRatio * 100),
            });
          }
        }
      },
      { threshold: buildThresholdList(threshold) },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds, threshold]);
}

function buildThresholdList(min: number): number[] {
  // Ensure a dense threshold list from min up to 1.0 for reliable ratios
  const thresholds: number[] = [];
  for (let i = Math.max(min, 0.1); i <= 1.0; i += 0.1) thresholds.push(Number(i.toFixed(2)));
  return thresholds;
}

export function useObserveElementsOnce(
  selector: string,
  eventName: AnalyticsEventName,
  getProps?: (el: Element) => Record<string, unknown>,
  options?: IntersectionObserverInit,
): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (seen.has(el)) continue;
          if (entry.isIntersecting) {
            seen.add(el);
            captureEvent(eventName, getProps ? getProps(el) : {});
            observer.unobserve(el);
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.25, ...(options || {}) },
    );

    const elements = Array.from(document.querySelectorAll(selector));
    elements.forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [selector, eventName, getProps, options]);
}

export function useScrollProgressMilestones(
  targetSelector: string,
  eventName: AnalyticsEventName,
  baseProps?: Record<string, unknown>,
  milestones: number[] = [25, 50, 75, 100],
): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.querySelector(targetSelector) as HTMLElement | null;
    if (!el) return;

    const fired = new Set<number>();
    let ticking = false;

    const compute = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportBottom = Math.min(
        window.innerHeight,
        Math.max(0, window.innerHeight - Math.max(0, rect.top)),
      );
      const scrolledWithin = viewportBottom + Math.max(0, -rect.top);
      const progress = Math.round(
        Math.max(0, Math.min(100, (scrolledWithin / Math.max(1, rect.height)) * 100)),
      );

      for (const m of milestones) {
        if (progress >= m && !fired.has(m)) {
          fired.add(m);
          captureEvent(eventName, { ...(baseProps || {}), progress_pct: m });
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetSelector, eventName, baseProps, milestones]);
}
