import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: rootDir,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: resolve(rootDir, "../dist"),
    emptyOutDir: true,
  },
  server: {
    allowedHosts: [".trycloudflare.com"],
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
