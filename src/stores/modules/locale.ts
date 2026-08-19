import { defineStore } from 'pinia'
import { store } from '../index'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useStorage } from '@/hooks/web/useStorage'
import type { Language, LocaleEntry } from '@/types/locale'

const { getStorage, setStorage } = useStorage('localStorage')

const elLocaleMap: Record<LocaleType, Language> = {
  'zh-CN': zhCn,
  en: en
}

const getStoredLang = (): LocaleType => {
  const lang = getStorage('lang')
  return lang === 'en' ? 'en' : 'zh-CN'
}

interface LocaleState {
  currentLocale: LocaleEntry
  localeMap: LocaleEntry[]
}

export const useLocaleStore = defineStore('locales', {
  state: (): LocaleState => {
    const lang = getStoredLang() || 'zh-CN'
    return {
      currentLocale: {
        lang,
        elLocale: elLocaleMap[lang]
      },
      // 多语言
      localeMap: [
        {
          lang: 'zh-CN',
          name: '简体中文'
        },
        {
          lang: 'en',
          name: 'English'
        }
      ]
    }
  },
  getters: {
    getCurrentLocale(): LocaleEntry {
      return this.currentLocale
    },
    getLocaleMap(): LocaleEntry[] {
      return this.localeMap
    }
  },
  actions: {
    setCurrentLocale(localeMap: LocaleEntry) {
      const lang = localeMap.lang
      this.currentLocale.lang = lang
      this.currentLocale.elLocale = elLocaleMap[lang]
      setStorage('lang', lang)
    }
  }
})

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
