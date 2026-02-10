import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { resolve } from 'path';
import { viteMockServe } from 'vite-plugin-mock';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isProd = mode === 'production';
  const isMock = mode === 'mock' || env.VITE_USE_MOCK === 'true';

  console.log('mode', mode);
  console.log('后端代理地址', `[ ${env.VITE_SERVER_PROXY_BASE_URL} ]`);
  console.log('登录代理地址', `[ ${env.VITE_SSO_LOGIN_URL} ]`);
  console.log('登录重定向至', `[ ${env.VITE_SERVER_PROXY_SSO_LOGIN_URL} ]`);
  console.log('是否使用 Mock', isMock);

  return {
    plugins: [
      vue(),
      // 自动导入组件
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
      // Mock 服务
      viteMockServe({
        mockPath: 'mock',
        localEnabled: isMock,
        prodEnabled: false,
        injectCode: `
          import { setupProdMockServer } from './mock/index';
          setupProdMockServer();
        `,
        logger: true,
      }),
      // 生产环境 gzip 压缩
      isProd &&
        compression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 1024,
          deleteOriginFile: false,
        }),
      // 生产环境 brotli 压缩
      isProd &&
        compression({
          algorithm: 'brotliCompress',
          ext: '.br',
          threshold: 1024,
          deleteOriginFile: false,
        }),
      // 打包分析 (可选)
      isProd &&
        visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      // Mock 模式下禁用代理
      proxy: isMock
        ? {}
        : {
            '/console': {
              target: env.VITE_SERVER_PROXY_BASE_URL,
              changeOrigin: true,
            },
            '/tenant': {
              target: env.VITE_SERVER_PROXY_BASE_URL,
              changeOrigin: true,
            },
            '/statistics': {
              target: env.VITE_SERVER_PROXY_BASE_URL,
              changeOrigin: true,
            },
            '/datasets': {
              target: env.VITE_SERVER_PROXY_BASE_URL,
              changeOrigin: true,
            },
            [env.VITE_SSO_LOGIN_URL]: {
              target: env.VITE_SERVER_PROXY_SSO_LOGIN_URL,
              changeOrigin: true,
              rewrite: path => path.replace(env.VITE_SSO_LOGIN_URL, ''),
              configure: (proxy, options) => {
                proxy.on('proxyReq', (proxyReq, req, res) => {
                  res.writeHead(302, {
                    Location:
                      env.VITE_SERVER_PROXY_SSO_LOGIN_URL +
                      req.url +
                      (mode === 'production' ? '&client_id=KNOW' : ''),
                  });
                  res.end();
                  req.destroy();
                });
              },
            },
          },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProd,
      // 代码分割
      rollupOptions: {
        output: {
          // 手动分块
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            echarts: ['echarts'],
          },
          // 静态资源分类
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: info => {
            const infoName = info.name || '';
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(infoName)) {
              return 'img/[name]-[hash][extname]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(infoName)) {
              return 'fonts/[name]-[hash][extname]';
            }
            if (/\.css$/i.test(infoName)) {
              return 'css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      // 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd ? ['console.log', 'console.info'] : [],
        },
        format: {
          comments: !isProd,
        },
      },
      // 小于此阈值的导入或引用资源将内联为 base64 编码
      assetsInlineLimit: 4096,
    },
    // CSS 配置
    css: {
      devSourcemap: true,
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'element-plus', 'echarts', 'axios'],
    },
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
    },
  };
});
