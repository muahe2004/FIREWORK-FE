/// <reference types="vite/client" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      { find: /^~/, replacement: "" },
      { find: "@", replacement: "/src" },
    ],
  },
  css: {
    // convert .app-header (less) to styles.appHeader (tsx)
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    port: 3010,
    proxy: {
      "/api": {
        target: "http://localhost:6688",
        // target: "https://co-dev.aiacademy.edu.vn",
        //secure: false,
        changeOrigin: true,
      }
    },
  },
});
