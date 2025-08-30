import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[], offset: number = 100): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const handleScroll = () => {
      const current = sectionIds.find((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return false;
        const { top } = element.getBoundingClientRect();
        return top <= offset && top > -element.offsetHeight;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    // Initialize on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}


