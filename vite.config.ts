import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/console": {
        target: "http://www.finna.com.cn",
        changeOrigin: true,
      },
      "/tenant": {
        target: "http://www.finna.com.cn",
        changeOrigin: true,
      },
      "/statistics": {
        target: "http://www.finna.com.cn",
        changeOrigin: true,
      },
      "/datasets": {
        target: "http://www.finna.com.cn",
        changeOrigin: true,
      },
    },
  },
});
