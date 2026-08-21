import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'
import { ElMessage, type ComponentSize } from 'element-plus'
import { useCssVar } from '@vueuse/core'
import { unref } from 'vue'
import { useDark } from '@vueuse/core'

export const useAppStore = defineStore(
  'app',
  () => {
    const sizeMap = ref<ComponentSize[]>(['default', 'large', 'small'])
    const mobile = ref(false)
    const title = ref(import.meta.env.VITE_APP_TITLE)
    const pageLoading = ref(false)
    const breadcrumb = ref(true)
    const breadcrumbIcon = ref(true)
    const collapse = ref(false)
    const uniqueOpened = ref(false)
    const hamburger = ref(true)
    const screenfull = ref(true)
    const size = ref(true)
    const locale = ref(true)
    const tagsView = ref(true)
    const tagsViewIcon = ref(true)
    const logo = ref(true)
    const fixedHeader = ref(true)
    const footer = ref(true)
    const greyMode = ref(false)
    const dynamicRouter = ref(true)
    const serverDynamicRouter = ref(true)
    const fixedMenu = ref(false)
    const layout = ref<LayoutType>('classic')
    const isDark = ref(false)
    const currentSize = ref<ComponentSize>('default')
    const theme = ref<ThemeTypes>({
      elColorPrimary: '#409eff',
      leftMenuBorderColor: 'inherit',
      leftMenuBgColor: '#001529',
      leftMenuBgLightColor: '#0f2438',
      leftMenuBgActiveColor: 'var(--el-color-primary)',
      leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
      leftMenuTextColor: '#bfcbd9',
      leftMenuTextActiveColor: '#fff',
      logoTitleTextColor: '#fff',
      logoBorderColor: 'inherit',
      topHeaderBgColor: '#fff',
      topHeaderTextColor: 'inherit',
      topHeaderHoverColor: '#f6f6f6',
      topToolBorderColor: '#eee'
    })

    const getBreadcrumb = computed(() => breadcrumb.value)
    const getBreadcrumbIcon = computed(() => breadcrumbIcon.value)
    const getCollapse = computed(() => collapse.value)
    const getUniqueOpened = computed(() => uniqueOpened.value)
    const getHamburger = computed(() => hamburger.value)
    const getScreenfull = computed(() => screenfull.value)
    const getSize = computed(() => size.value)
    const getLocale = computed(() => locale.value)
    const getTagsView = computed(() => tagsView.value)
    const getTagsViewIcon = computed(() => tagsViewIcon.value)
    const getLogo = computed(() => logo.value)
    const getFixedHeader = computed(() => fixedHeader.value)
    const getGreyMode = computed(() => greyMode.value)
    const getDynamicRouter = computed(() => dynamicRouter.value)
    const getServerDynamicRouter = computed(() => serverDynamicRouter.value)
    const getFixedMenu = computed(() => fixedMenu.value)
    const getPageLoading = computed(() => pageLoading.value)
    const getLayout = computed(() => layout.value)
    const getTitle = computed(() => title.value)
    const getIsDark = computed(() => isDark.value)
    const getCurrentSize = computed(() => currentSize.value)
    const getSizeMap = computed(() => sizeMap.value)
    const getMobile = computed(() => mobile.value)
    const getTheme = computed(() => theme.value)
    const getFooter = computed(() => footer.value)

    const setBreadcrumb = (val: boolean) => {
      breadcrumb.value = val
    }
    const setBreadcrumbIcon = (val: boolean) => {
      breadcrumbIcon.value = val
    }
    const setCollapse = (val: boolean) => {
      collapse.value = val
    }
    const setUniqueOpened = (val: boolean) => {
      uniqueOpened.value = val
    }
    const setHamburger = (val: boolean) => {
      hamburger.value = val
    }
    const setScreenfull = (val: boolean) => {
      screenfull.value = val
    }
    const setSize = (val: boolean) => {
      size.value = val
    }
    const setLocale = (val: boolean) => {
      locale.value = val
    }
    const setTagsView = (val: boolean) => {
      tagsView.value = val
    }
    const setTagsViewIcon = (val: boolean) => {
      tagsViewIcon.value = val
    }
    const setLogo = (val: boolean) => {
      logo.value = val
    }
    const setFixedHeader = (val: boolean) => {
      fixedHeader.value = val
    }
    const setGreyMode = (val: boolean) => {
      greyMode.value = val
    }
    const setDynamicRouter = (val: boolean) => {
      dynamicRouter.value = val
    }
    const setServerDynamicRouter = (val: boolean) => {
      serverDynamicRouter.value = val
    }
    const setFixedMenu = (val: boolean) => {
      fixedMenu.value = val
    }
    const setPageLoading = (val: boolean) => {
      pageLoading.value = val
    }
    const setLayout = (val: LayoutType) => {
      if (mobile.value && val !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其它布局')
        return
      }
      layout.value = val
    }
    const setTitle = (val: string) => {
      title.value = val
    }
    const setMobile = (val: boolean) => {
      mobile.value = val
    }
    const setFooter = (val: boolean) => {
      footer.value = val
    }
    const setCurrentSize = (val: ComponentSize) => {
      currentSize.value = val
    }
    const setTheme = (val: Partial<ThemeTypes>) => {
      theme.value = Object.assign(theme.value, val)
    }

    const setPrimaryLight = () => {
      if (theme.value.elColorPrimary) {
        const elColorPrimary = theme.value.elColorPrimary
        const color = isDark.value ? '#000000' : '#ffffff'
        const lightList = [3, 5, 7, 8, 9]
        lightList.forEach((v) => {
          setCssVar(`--el-color-primary-light-${v}`, mix(color, elColorPrimary, v / 10))
        })
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2))
      }
    }

    const setIsDark = (val: boolean) => {
      isDark.value = val
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      setPrimaryLight()
    }

    const setCssVarTheme = () => {
      for (const key in theme.value) {
        setCssVar(`--${humpToUnderline(key)}`, theme.value[key as keyof ThemeTypes])
      }
      setPrimaryLight()
    }

    const setMenuTheme = (color: string) => {
      const primaryColor = useCssVar('--el-color-primary', document.documentElement)
      const isDarkColor = colorIsDark(color)
      const themeRecord: Recordable = {
        leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
        leftMenuBgColor: color,
        leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
        leftMenuBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor) as string, 0.1),
        leftMenuCollapseBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor) as string, 0.1),
        leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
        leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
        logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
        logoBorderColor: isDarkColor ? color : '#eee'
      }
      setTheme(themeRecord)
      setCssVarTheme()
    }

    const setHeaderTheme = (color: string) => {
      const isDarkColor = colorIsDark(color)
      const textColor = isDarkColor ? '#fff' : 'inherit'
      const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
      const topToolBorderColor = isDarkColor ? color : '#eee'
      setCssVar('--top-header-bg-color', color)
      setCssVar('--top-header-text-color', textColor)
      setCssVar('--top-header-hover-color', textHoverColor)
      setTheme({
        topHeaderBgColor: color,
        topHeaderTextColor: textColor,
        topHeaderHoverColor: textHoverColor,
        topToolBorderColor
      })
      if (getLayout.value === 'top') {
        setMenuTheme(color)
      }
    }

    const initTheme = () => {
      const dark = useDark({
        valueDark: 'dark',
        valueLight: 'light'
      })
      dark.value = isDark.value
      const newTitle = import.meta.env.VITE_APP_TITLE
      if (newTitle !== title.value) {
        setTitle(newTitle)
      }
    }

    return {
      sizeMap,
      mobile,
      title,
      pageLoading,
      breadcrumb,
      breadcrumbIcon,
      collapse,
      uniqueOpened,
      hamburger,
      screenfull,
      size,
      locale,
      tagsView,
      tagsViewIcon,
      logo,
      fixedHeader,
      footer,
      greyMode,
      dynamicRouter,
      serverDynamicRouter,
      fixedMenu,
      layout,
      isDark,
      currentSize,
      theme,
      getBreadcrumb,
      getBreadcrumbIcon,
      getCollapse,
      getUniqueOpened,
      getHamburger,
      getScreenfull,
      getSize,
      getLocale,
      getTagsView,
      getTagsViewIcon,
      getLogo,
      getFixedHeader,
      getGreyMode,
      getDynamicRouter,
      getServerDynamicRouter,
      getFixedMenu,
      getPageLoading,
      getLayout,
      getTitle,
      getIsDark,
      getCurrentSize,
      getSizeMap,
      getMobile,
      getTheme,
      getFooter,
      setBreadcrumb,
      setBreadcrumbIcon,
      setCollapse,
      setUniqueOpened,
      setHamburger,
      setScreenfull,
      setSize,
      setLocale,
      setTagsView,
      setTagsViewIcon,
      setLogo,
      setFixedHeader,
      setGreyMode,
      setDynamicRouter,
      setServerDynamicRouter,
      setFixedMenu,
      setPageLoading,
      setLayout,
      setTitle,
      setIsDark,
      setCurrentSize,
      setMobile,
      setTheme,
      setCssVarTheme,
      setFooter,
      setPrimaryLight,
      setMenuTheme,
      setHeaderTheme,
      initTheme
    }
  },
  {
    persist: {
      key: 'app-config'
    }
  }
)

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
