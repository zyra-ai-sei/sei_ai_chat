import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { ParallaxProvider } from "react-scroll-parallax";
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root")!;

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootElement,
    <Provider store={store}>
      <HelmetProvider>
        <ParallaxProvider>
          <App />
        </ParallaxProvider>
      </HelmetProvider>
    </Provider>,
  );
} else {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <HelmetProvider>
        <ParallaxProvider>
          <App />
        </ParallaxProvider>
      </HelmetProvider>
    </Provider>,
  );
}
