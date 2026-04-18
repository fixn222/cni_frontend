import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { SessionProvider } from "./providers/SessionProvider.tsx";
import "./index.css";
import { CountryProvider } from "./providers/CountryProvider.tsx";
import { ApplicationProvider } from "./providers/ApplicationProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CountryProvider>
        <SessionProvider>
          <ApplicationProvider>
            <App />

          </ApplicationProvider>
        </SessionProvider>
      </CountryProvider>
    </BrowserRouter>
  </StrictMode>
);
