import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://stacksapp-backend-main.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    // Enable source maps for production so deployed stack traces map to your source files
    sourcemap: true,
  },

  // Copy _redirects into dist after build (for Netlify/Cloudflare SPA routing)
  closeBundle() {
    const redirectsPath = resolve(__dirname, "_redirects");
    const distPath = resolve(__dirname, "dist/_redirects");

    if (existsSync(redirectsPath)) {
      try {
        copyFileSync(redirectsPath, distPath);
        console.log("✅ _redirects file copied to dist/");
      } catch (err) {
        console.error("❌ Failed to copy _redirects file:", err);
      }
    } else {
      console.warn("⚠️ No _redirects file found at project root.");
    }
  },
});
