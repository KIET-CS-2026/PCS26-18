import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@/components/ui/theme-provider";
import QueryProvider from "./QueryProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/Socket";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
);
