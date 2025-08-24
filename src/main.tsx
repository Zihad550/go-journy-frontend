import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import { store } from "./redux/store.ts";
import { router } from "./routes/index.tsx";

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
);
