export const manifestForPlugIn = {
  registerType: "prompt",
  includeAssests: ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Zyra-chat-app",
    short_name: "Zyra-chat-app",
    description: "Zyra AI | Conversational Crypto Trading & Portfolio Management",
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
  },
};
