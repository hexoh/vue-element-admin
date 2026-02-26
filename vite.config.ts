import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),

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
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
