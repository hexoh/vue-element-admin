import 'vue/jsx'

// 引入 UnoCSS
import '@/plugins/unocss'

// 引入全局样式
import './styles/main.css'

// 引入动画
import '@/plugins/animate'

// 初始化多语言
import { setupI18n } from '@/plugins/vue-i18n'

// 引入状态管理
import { setupStore } from '@/stores'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入 Element Plus
import { setupElementPlus } from '@/plugins/element-plus'

import { createApp } from 'vue'

import App from './App.vue'

import router from './router'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  app.use(router)

  app.mount('#app')
}

setupAll()
