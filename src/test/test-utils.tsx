import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

// Custom render function that includes common providers
function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <HelmetProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </HelmetProvider>
    );
  };

  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
