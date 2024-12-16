import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// vite配置学习参考
// vite天生支持css等预处理语言
// 开发模式的配置：
//   // 图片base64转码
//   build: {

//   },
//   server: {
//     port: 2000,
//     proxy: {
//       "/api": {
//         target:"www.xxx.com"
//         rewrite:(path) => {
//           return path.replace(正则)
//         }
//       }
//     },
//     headers: {

//     }
//   }