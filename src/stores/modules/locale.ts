import { defineStore } from 'pinia'
import { store } from '../index'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useStorage } from '@/hooks/web/useStorage'
import type { Language, LocaleEntry } from '@/hooks/web/types/locale'

const { getStorage, setStorage } = useStorage('localStorage')

const elLocaleMap: Record<LocaleType, Language> = {
  'zh-CN': zhCn,
  en: en
}

const getStoredLang = (): LocaleType => {
  const lang = getStorage('lang')
  return lang === 'en' ? 'en' : 'zh-CN'
}

export const useLocaleStore = defineStore('locales', () => {
  const lang = getStoredLang() || 'zh-CN'

  const currentLocale = ref<LocaleEntry>({
    lang,
    elLocale: elLocaleMap[lang]
  })

  const localeMap = ref<LocaleEntry[]>([
    {
      lang: 'zh-CN',
      name: '简体中文'
    },
    {
      lang: 'en',
      name: 'English'
    }
  ])

  const getCurrentLocale = computed(() => currentLocale.value)
  const getLocaleMap = computed(() => localeMap.value)

  const setCurrentLocale = (localeMapItem: LocaleEntry) => {
    const localeLang = localeMapItem.lang
    currentLocale.value.lang = localeLang
    currentLocale.value.elLocale = elLocaleMap[localeLang]
    setStorage('lang', localeLang)
  }

  return {
    currentLocale,
    localeMap,
    getCurrentLocale,
    getLocaleMap,
    setCurrentLocale
  }
})

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
