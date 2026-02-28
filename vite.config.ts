import { fileURLToPath, URL } from 'node:url'
import { type ConfigEnv, type UserConfigExport, loadEnv } from 'vite'
import { createViteBuildConfig } from './vite.build'
import { createVitePluginConfig } from './vite.plugin'

// https://vite.dev/config/
export default (configEnv: ConfigEnv): UserConfigExport => {
  const env = loadEnv(configEnv.mode, process.cwd())

  return {
    base: env.VITE_BASE_PATH || '/', // 设置基础路径，默认为根路径

    // 配置开发服务器选项
    server: {
      port: 3000, // 开发服务器端口，默认为 3000
      host: '0.0.0.0', // host: "0.0.0.0" 允许外部访问，默认为 "localhost"
      open: false, // 启动开发服务器时自动打开浏览器，默认为 false
      proxy: {
        // 配置代理，将 API 请求转发到后端服务器
        '/api': {
          target: 'http://localhost:4000', // 后端服务器地址
          changeOrigin: true, // 是否修改请求头中的 Origin 字段，默认为 true
          rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，将 /api 前缀去掉
        }
      }
    },

    // 配置构建选项
    build: createViteBuildConfig(env),
    // 配置插件
    plugins: createVitePluginConfig(env),

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/variables.module.scss";'
        }
      }
    },
    // 配置路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
}
