import 'vue/jsx'

// 引入 UnoCSS
import '@/plugins/unocss'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

import './styles/main.css'

import { createApp } from 'vue'

import { createPinia } from 'pinia'

import App from './App.vue'

import router from './router'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  app.use(createPinia())

  app.use(router)

  app.mount('#app')
}

setupAll()
