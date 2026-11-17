import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite settings.
 *
 * The React app runs on port 5173, but the Express server runs on port 3000.
 * The proxy forwards these paths to the server, so the browser thinks
 * everything comes from one place. That also lets the canvas read the
 * thumbnail's pixels (browsers block that for images from another origin).
 */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/thumbnail": "http://localhost:3000",
      "/process": "http://localhost:3000",
      "/results": "http://localhost:3000",
    },
  },
});