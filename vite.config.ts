import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  console.log('当前环境变量:', env.VITE_SERVER_PROXY_BASE_URL); // ✅ 可读取

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/console": {
          target: env.VITE_SERVER_PROXY_BASE_URL,
          changeOrigin: true,
        },
        "/tenant": {
          target: env.VITE_SERVER_PROXY_BASE_URL,
          changeOrigin: true,
        },
        "/statistics": {
          target: env.VITE_SERVER_PROXY_BASE_URL,
          changeOrigin: true,
        },
        "/datasets": {
          target: env.VITE_SERVER_PROXY_BASE_URL,
          changeOrigin: true,
        },
        // 生产环境配置
        "/idp/oauth2/authorize": {
          target: env.VITE_SERVER_PROXY_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
