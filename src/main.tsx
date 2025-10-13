import { StrictMode } from "react";
import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter, RouterProvider } from "react-router";
import "@fontsource/inter";
import PlaceholderPage from "./pages/PlaceholderPage";
import "./index.sass";
import { CssVarsProvider } from "@mui/joy/styles/CssVarsProvider";
import ProfilePicturePage from "./pages/ProfilePicturePage";

const router = createBrowserRouter([
  { path: "*", element: <PlaceholderPage /> },
  { path: "/tools/ppgen", element: <ProfilePicturePage /> },
]);

let environmentName;
let replaysSessionSampleRate;

switch (import.meta.env.VITE_ENVIRONMENT) {
  case "prod":
    environmentName = "Production";
    replaysSessionSampleRate = 0.1;
    break;
  case "dev":
    environmentName = "Development";
    replaysSessionSampleRate = 1.0;
    break;
}

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: environmentName,

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],

  // Log tracing
  enableLogs: true,

  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Session Replay
  replaysSessionSampleRate: replaysSessionSampleRate, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const container = document.getElementById("root")!;

createRoot(container, {
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
        console.warn('Uncaught error', error, errorInfo.componentStack);
    }),
    // Callback called when React catches an error in an ErrorBoundary.
    onCaughtError: Sentry.reactErrorHandler(),
    // Callback called when React automatically recovers from errors.
    onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENTID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <CssVarsProvider defaultMode="system">
        <RouterProvider router={router} />
      </CssVarsProvider>
    </Auth0Provider>
  </StrictMode>,
);
