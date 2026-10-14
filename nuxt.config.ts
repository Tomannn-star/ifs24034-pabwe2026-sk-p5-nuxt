import tailwindcss from "@tailwindcss/vite";

const customPort = Number(process.env.APP_PORT || process.env.PORT) || 3000;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  telemetry: false,

  // Disable SSR for SPA mode (client-side routing and storage)
  ssr: false,

  // Let Nuxt look into src/ for application source files
  srcDir: "src/",

  // Enable vue-router; routes are supplied by src/router.options.ts
  pages: true,

  css: ["~/index.css"],

  modules: ["@pinia/nuxt"],

  routeRules: {
    "/**": {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    define: {
      DELCOM_BASEURL: JSON.stringify(
        process.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("sweetalert2")) {
                return "sweetalert2";
              }
              if (id.includes("lucide-vue-next")) {
                return "icons";
              }
            }
          },
        },
      },
    },
  },

  devServer: {
    port: customPort,
  },

  nitro: {
    devPort: customPort,
    externals: {
      inline: ["@vue/shared"],
    },
  },

  app: {
    head: {
      title: "Delcom Cash Flow",
      htmlAttrs: {
        lang: "id",
      },
      meta: [
        {
          name: "description",
          content: "Delcom Cash Flow - Aplikasi manajemen pencatatan keuangan dan arus kas pribadi yang praktis, cepat, dan aman.",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "preload",
          as: "style",
          href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap",
          media: "print",
          onload: "this.media='all'",
        },
      ],
      noscript: [
        {
          children: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap">',
        },
      ],
      bodyAttrs: {
        class: "bg-slate-50 text-slate-900 font-sans antialiased min-h-screen",
      },
    },
  },
});

