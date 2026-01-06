import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

import posthog from 'posthog-js';
import { HelmetProvider } from 'react-helmet-async';

// Initialize PostHog (Analytics)
// Replace 'phc_TEST' with actual key from .env
posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_TEST_KEY_JUST_A_PLACEHOLDER', {
  api_host: 'https://app.posthog.com',
  loaded: (posthog) => {
    if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing();
  },
});

console.log("Rendering Main entry point");
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
