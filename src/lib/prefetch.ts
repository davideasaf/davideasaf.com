export function prefetchDetailPages(): void {
  if (typeof window === "undefined") return;
  const io = new IntersectionObserver((entries, observer) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        import("@/pages/Project");
        import("@/pages/NeuralNote");
        observer.disconnect();
        break;
      }
    }
  });
  const el = document.querySelector('[data-prefetch="details"]');
  if (el) io.observe(el);
}
