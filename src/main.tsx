import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  // biome-ignore lint: Root element missing is critical and should log in dev.
  console.error("Root element #root not found");
}
