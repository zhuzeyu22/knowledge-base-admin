import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("mode", mode); // ✅ 可读取
  console.log("后端代理地址", `[ ${env.VITE_SERVER_PROXY_BASE_URL} ]`); // ✅ 可读取
  console.log("登录代理地址", `[ ${env.VITE_SSO_LOGIN_URL} ]`); // ✅ 可读取
  console.log("登录重定向至", `[ ${env.VITE_SERVER_PROXY_SSO_LOGIN_URL} ]`); // ✅ 可读取

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock', // 指定 mock 文件目录（相对于项目根目录）
        localEnabled: true, // 开发环境开启 mock
        prodEnabled: false, // 生产环境关闭
        injectCode: `
          import { setupProdMockServer } from './mock-prod-server';
          setupProdMockServer();
        `,
        logger: true, // 打印 mock 日志
      }),
    ],
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
        [env.VITE_SSO_LOGIN_URL]: {
          target: env.VITE_SERVER_PROXY_SSO_LOGIN_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(env.VITE_SSO_LOGIN_URL, ""),
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              // 直接响应 302，不转发请求
              res.writeHead(302, {
                Location:
                  env.VITE_SERVER_PROXY_SSO_LOGIN_URL +
                  req.url +
                  (mode == "production" ? "&client_id=KNOW" : ""),
              });
              res.end();
              // 中断代理
              req.destroy();
            });
          },
        },
      },
    },
  };
});
