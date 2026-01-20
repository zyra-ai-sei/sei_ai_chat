import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { join } from "path";
import { defineConfig, loadEnv } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
const manifestForPlugIn = {
  registerType: "autoUpdate",
  selfDestroying: true,
  includeAssests: ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Chaquen",
    short_name: "Chaquen",
    description: "I am a simple vite app",
    icons: [
      {
        src: "/pwa/logo192.svg",
        sizes: "192x192",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/pwa/logo512.svg",
        sizes: "512x512",
        type: "/chaquen.svg",
        purpose: "favicon",
      },
      {
        src: "/pwa/logo512.svg",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/pwa/logo512.svg",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      sourcemap: false,
    },
    define: {
      "process.env.SOME_KEY": JSON.stringify(env.SOME_KEY),
    },
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    resolve: {
      alias: {
        "@": join(__dirname, "./src"),
        "@assets": join(__dirname, "src/assets"),
        "@components": join(__dirname, "src/components"),
        contract: join(__dirname, "src/contract"),
        components: join(__dirname, "src/components"),
        "@modules": join(__dirname, "src/modules"),
        "@layouts": join(__dirname, "src/layouts"),
        layouts: join(__dirname, "src/layouts"),
        "@pages": join(__dirname, "src/pages"),
        pages: join(__dirname, "src/pages"),
        "@utility": join(__dirname, "src/utility"),
        utility: join(__dirname, "src/utility"),
        "@stores": join(__dirname, "src/stores"),
        "@hooks": join(__dirname, "src/hooks"),
        hooks: join(__dirname, "src/hooks"),
        "@enum": join(__dirname, "src/enum"),
        "@hoc": join(__dirname, "src/hoc"),
        "@interface": join(__dirname, "src/interface"),
        "@scss": join(__dirname, "src/scss"),
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
          }),
        ],
      },
    },
    server: {
      proxy: {
        "/github-api": {
          target: "https://raw.githubusercontent.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/github-api/, ""),
        },
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/strategies-api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/strategies-api/, ""),
        },
      },
      port: 9027,
      host: "0.0.0.0",
    },
  };
});
