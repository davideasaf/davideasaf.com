import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToHashOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  maxAttempts?: number;
  timeout?: number;
}

export const useScrollToHash = (options: ScrollToHashOptions = {}) => {
  const location = useLocation();
  const {
    behavior = "smooth",
    block = "start",
    inline = "nearest",
    maxAttempts = 10,
    timeout = 3000,
  } = options;

  useEffect(() => {
    const { hash } = location;

    if (hash) {
      const targetId = decodeURIComponent(hash.replace("#", ""));

      const scrollToElement = (el: Element) => {
        el.scrollIntoView({ behavior, block, inline });
      };

      const tryScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          scrollToElement(el);
          return true;
        }
        return false;
      };

      // First, try immediately
      if (tryScroll()) return;

      // Set up observers for dynamic content
      let timeoutId: NodeJS.Timeout;
      let resizeObserver: ResizeObserver | null = null;
      let mutationObserver: MutationObserver | null = null;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (resizeObserver) resizeObserver.disconnect();
        if (mutationObserver) mutationObserver.disconnect();
      };

      // Try scrolling with increasing delays using requestAnimationFrame for better performance
      let attempts = 0;

      const scheduleScroll = () => {
        if (attempts >= maxAttempts) return;

        requestAnimationFrame(() => {
          if (tryScroll()) {
            cleanup();
            return;
          }
          attempts++;
          timeoutId = setTimeout(scheduleScroll, Math.min(100 * attempts, 500));
        });
      };

      scheduleScroll();

      // Set up ResizeObserver to watch for layout changes
      resizeObserver = new ResizeObserver(() => {
        if (tryScroll()) cleanup();
      });
      resizeObserver.observe(document.body);

      // Set up MutationObserver to watch for DOM changes
      mutationObserver = new MutationObserver(() => {
        if (tryScroll()) cleanup();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Fallback timeout
      timeoutId = setTimeout(cleanup, timeout);

      return cleanup;
    } else {
      // No hash: scroll to top on route change
      window.scrollTo({ top: 0, behavior });
    }
  }, [location, behavior, block, inline, maxAttempts, timeout]);
};
