import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { ParallaxProvider } from "react-scroll-parallax";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <HelmetProvider>
      <ParallaxProvider>
        <App />
      </ParallaxProvider>
    </HelmetProvider>
  </Provider>
);
