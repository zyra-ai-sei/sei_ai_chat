import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";

import * as Sentry from "@sentry/react";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";
import moengage from "@moengage/web-sdk";
moengage.initialize({
  app_id: import.meta.env?.VITE_BASE_MOENGAGE_APP_ID,
  cluster: "DC_3",
  debug_logs: 0,
});

amplitude.init(import.meta.env?.VITE_BASE_AMPLITUDE_INIT_ID, {
  autocapture: true,
});
const sessionReplayTracking = sessionReplayPlugin({
  sampleRate: 0.1,
});
amplitude.add(sessionReplayTracking);
Sentry.init({
  dsn: import.meta.env?.VITE_BASE_SENTRY_KEY,
  integrations: [Sentry.browserTracingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 0.2, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    /^https:\/\/t20-staging.chaquen\.io\/api/,
    /^https:\/\/app.chaquen\.io\/api/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  ignoreErrors: [
    /^Buffer is not defined/,
    /^ReferenceError: Buffer is not defined/,
    /^ReferenceError/,
  ],
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
