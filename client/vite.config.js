import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  // 配置别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
    },
  },
  plugins: [react()],
  server: {
    open: true,   // 启动后自动打开浏览器
  }
})

// vite配置学习参考
// vite天生支持css等预处理语言
// 开发模式的配置：
  // resolve: {
  //   extesions: [".js", ".ts", ".css"],
  //   alias: {
  //     "@": __dirname + "/src"
  //   }
  // },
  // // 图片base64转码
  // build: {
  //   assetInlineLimit: 20000
  // },
  // server: {
  //   port: 2000,
  //   proxy: {
  //     "/api": {
  //       target:"www.xxx.com"
  //       rewrite:(path) => {
  //         return path.replace(正则)
  //       }
  //     }
  //   },
  //   headers: {

  //   }
  // }