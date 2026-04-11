import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";

export default defineConfig({
  // Set base so assets load correctly when served from:
  // https://stack6649-arch.github.io/keymusecommerce
  // Permanent fix for custom domain / GitHub Pages: use a relative base so assets are referenced as ./assets/...
  base: "./",

  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://keymuse-backend.onrender.com",
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

  // Copy 404.html and _redirects into dist after build (for GitHub Pages SPA routing)
  closeBundle() {
    const notFoundPath = resolve(__dirname, "public/404.html");
    const distNotFoundPath = resolve(__dirname, "dist/404.html");
    const redirectsPath = resolve(__dirname, "_redirects");
    const distRedirectsPath = resolve(__dirname, "dist/_redirects");

    if (existsSync(notFoundPath)) {
      try {
        copyFileSync(notFoundPath, distNotFoundPath);
        console.log("✅ 404.html file copied to dist/");
      } catch (err) {
        console.error("❌ Failed to copy 404.html file:", err);
      }
    } else {
      console.warn("⚠️ No 404.html file found at public/ directory.");
    }

    if (existsSync(redirectsPath)) {
      try {
        copyFileSync(redirectsPath, distRedirectsPath);
        console.log("✅ _redirects file copied to dist/");
      } catch (err) {
        console.error("❌ Failed to copy _redirects file:", err);
      }
    } else {
      console.warn("⚠️ No _redirects file found at project root.");
    }
  },
});
