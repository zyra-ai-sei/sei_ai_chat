import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";

import * as Sentry from "@sentry/react";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

const sessionReplayTracking = sessionReplayPlugin({
  sampleRate: 0.1,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
