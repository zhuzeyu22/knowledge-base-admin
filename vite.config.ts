import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      find:"@",replacement:"/src",
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
    },
  },
});
