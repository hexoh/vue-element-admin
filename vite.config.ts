import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { type ConfigEnv, type UserConfigExport, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgLoader from 'vite-svg-loader'
import ServerUrlCopy from 'vite-plugin-url-copy'
import progress from 'vite-plugin-progress'
import { formatISO } from 'date-fns'
import { visualizer } from 'rollup-plugin-visualizer'

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
    build: {
      chunkSizeWarningLimit: 2000, // 消除打包大小超过 500kb 警告，默认为 500
      outDir: env.VITE_OUT_DIR || 'dist', // 输出目录，默认为 'dist'
      assetsDir: 'assets', // 静态资源目录，默认为 'assets'
      sourcemap: env.VITE_SOURCEMAP === 'true', // 是否生成 source map 文件，默认为 false
      minify: 'terser', // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      /** 在打包代码时移除 console.log、debugger 和 注释 */
      terserOptions: {
        compress: {
          drop_console: true, // 删除 console 语句，默认为 false
          drop_debugger: true, // 删除 debugger 语句，默认为 false
          pure_funcs: ['consola.log', 'consola.error', 'consola.info', 'consola.warn'] // 删除指定的函数调用，支持字符串或数组形式，默认为 []
        }
      },
      /** 配置 Rollup 选项，控制输出文件的命名和目录结构 */
      rollupOptions: {
        plugins: env.VITE_USE_BUNDLE_ANALYZER === 'true' ? [visualizer()] : undefined, // 如果启用包分析，则添加 visualizer 插件
        output: {
          manualChunks: (id) => {
            // 按依赖分组
            const chunks = {
              'vue-chunks': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
              'element-plus': ['element-plus'],
              'wang-editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
              echarts: ['echarts', 'echarts-wordcloud'],
              lodash: ['lodash-es']
            }

            for (const [chunkName, modules] of Object.entries(chunks)) {
              if (modules.some((module) => id.includes(module))) {
                return chunkName
              }
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            return 'vendor'
          },
          chunkFileNames: 'js/[name]-[hash].js', // 代码分割后的文件名格式
          entryFileNames: 'js/[name]-[hash].js', // 入口文件名格式
          assetFileNames: ({ name }) => {
            if (/\.(css|s[ac]ss)$/.test(name ?? '')) {
              return 'css/[name]-[hash][extname]' // 如果是 CSS 文件，则放在 css 目录下
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name ?? '')) {
              return 'images/[name]-[hash][extname]' // 如果是图片文件，则放在 images 目录下
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(name ?? '')) {
              return 'fonts/[name]-[hash][extname]' // 如果是字体文件，则放在 fonts 目录下
            }
            return 'assets/[name]-[hash][extname]' // 其他静态资源放在 assets 目录下
          }
        }
      }
    },

    // 配置插件
    plugins: [
      vue(), // Vue 插件，支持 Vue 单文件组件（.vue 文件）
      vueJsx(), // Vue JSX 插件，支持在 Vue 组件中使用 JSX 语法
      vueDevTools(), // Vue DevTools 插件，方便在开发过程中调试 Vue 组件
      ServerUrlCopy(), // 开发服务器 URL 复制插件，方便在开发过程中快速复制本地或网络地址
      progress(), // 构建进度插件，显示构建过程中的进度条

      // 配置按需自动加载组件
      Components({
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            prefix: 'icon' // 自定义图标组件前缀，默认是 'i'，这里改为 'icon' 以防冲突
            // 可以选择开启 collection 限制，比如只允许 mdi 和 ep (Element Plus)
            // enabledCollections: ['mdi', 'ep']
          })
        ],
        dts: 'types/components.d.ts' // 自动生成 ts 声明文件，解决 TS 报错
      }),

      // 配置 Iconify 图标
      Icons({
        compiler: 'vue3', // 指定编译器为 vue3
        autoInstall: true // 自动安装检测到的图标集（如果有未安装的，会自动用包管理器安装）
      }),

      /** 将 SVG 静态图转化为 Vue 组件 */
      svgLoader({ defaultImport: 'url' }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/images/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
      }),
      /** 加入打包时间戳 */
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(/<\/body>/, `<!-- build stamp ${formatISO(new Date())} -->\n</body>`)
        }
      }
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
}
