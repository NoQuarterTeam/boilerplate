import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite-plus"

export default defineConfig({
  resolve: { tsconfigPaths: true },
  ssr: {
    noExternal: ["react", "react-dom", "use-sync-external-store"],
  },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart({
      router: { routeToken: "layout" },
      importProtection: {
        client: { specifiers: ["@boilerplate/db/server"], files: ["**/*.server.*", "**/server/**"] },
      },
    }),
    viteReact(),
  ],
})
