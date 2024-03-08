import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from "path";

const alias = {
  "@": resolve(__dirname, ".", "src"),
  "views": resolve(__dirname, ".", "src/views/"),
};
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return {
    plugins: [
      vue(),
      vueJsx(),
    ],
    resolve: {
      alias,
    },
    base: env.VITE_PUBLIC_PATH,
    build: {
      target: "modules", //设置最终构建的浏览器兼容目标  //es2015(编译成es5) | modules
      outDir: "dist", // 构建得包名  默认：dist
      assetsDir: "static", // 静态资源得存放路径文件名 static
      sourcemap: false, //构建后是否生成 source map 文件
      minify: "esbuild", // 项目压缩 :boolean | 'terser' | 'esbuild'
      chunkSizeWarningLimit: 1000, //chunk 大小警告的限制（以 kbs 为单位）默认：500
      cssTarget: "chrome61", //防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制符号的形式
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          }
        },
      },
    },
    server: {
      host: true,
      port: 6061,
      open: false,
      cors: true,
      hmr: true, //开启热加载
      // 代理跨域
      proxy: {
        "/api": {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/~\/api/, ''),
        },
      },
    },
    // 打包去除 console.log && debugger
    esbuild: {
      pure: ["console.log", "debugger"],
    },
  }
})