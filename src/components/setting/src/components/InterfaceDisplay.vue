<script setup lang="ts">
import { ElSwitch, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/stores/modules/app'
import { computed, ref, watch } from 'vue'
import { setCssVar } from '@/utils'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('interface-display')

const appStore = useAppStore()

const { t } = useI18n()

// 面包屑
const breadcrumb = ref(appStore.getBreadcrumb)

const breadcrumbChange = (val: string | number | boolean) => {
  appStore.setBreadcrumb(val as boolean)
}

// 面包屑图标
const breadcrumbIcon = ref(appStore.getBreadcrumbIcon)

const breadcrumbIconChange = (val: string | number | boolean) => {
  appStore.setBreadcrumbIcon(val as boolean)
}

// 折叠图标
const hamburger = ref(appStore.getHamburger)

const hamburgerChange = (val: string | number | boolean) => {
  appStore.setHamburger(val as boolean)
}

// 全屏图标
const screenfull = ref(appStore.getScreenfull)

const screenfullChange = (val: string | number | boolean) => {
  appStore.setScreenfull(val as boolean)
}

// 尺寸图标
const size = ref(appStore.getSize)

const sizeChange = (val: string | number | boolean) => {
  appStore.setSize(val as boolean)
}

// 多语言图标
const locale = ref(appStore.getLocale)

const localeChange = (val: string | number | boolean) => {
  appStore.setLocale(val as boolean)
}

// 标签页
const tagsView = ref(appStore.getTagsView)

const tagsViewChange = (val: string | number | boolean) => {
  // 切换标签栏显示时，同步切换标签栏的高度
  setCssVar('--tags-view-height', (val as boolean) ? '35px' : '0px')
  appStore.setTagsView(val as boolean)
}

// 标签页图标
const tagsViewIcon = ref(appStore.getTagsViewIcon)

const tagsViewIconChange = (val: string | number | boolean) => {
  appStore.setTagsViewIcon(val as boolean)
}

// logo
const logo = ref(appStore.getLogo)

const logoChange = (val: string | number | boolean) => {
  appStore.setLogo(val as boolean)
}

// 菜单手风琴
const uniqueOpened = ref(appStore.getUniqueOpened)

const uniqueOpenedChange = (val: string | number | boolean) => {
  appStore.setUniqueOpened(val as boolean)
}

// 固定头部
const fixedHeader = ref(appStore.getFixedHeader)

const fixedHeaderChange = (val: string | number | boolean) => {
  appStore.setFixedHeader(val as boolean)
}

// 页脚
const footer = ref(appStore.getFooter)

const footerChange = (val: string | number | boolean) => {
  appStore.setFooter(val as boolean)
}

// 灰色模式
const greyMode = ref(appStore.getGreyMode)

const greyModeChange = (val: string | number | boolean) => {
  appStore.setGreyMode(val as boolean)
}

// 动态路由
const dynamicRouter = ref(!!appStore.getDynamicRouter)

const dynamicRouterChange = (val: string | number | boolean) => {
  ElMessage.info(t('setting.reExperienced'))
  appStore.setDynamicRouter(val as boolean)
}

// 服务端动态路由
const serverDynamicRouter = ref(appStore.getServerDynamicRouter)

const serverDynamicRouterChange = (val: string | number | boolean) => {
  ElMessage.info(t('setting.reExperienced'))
  appStore.setServerDynamicRouter(val as boolean)
}

// 固定菜单
const fixedMenu = ref(appStore.getFixedMenu)

const fixedMenuChange = (val: string | number | boolean) => {
  appStore.setFixedMenu(val as boolean)
}

const layout = computed(() => appStore.getLayout)

watch(
  () => layout.value,
  (n) => {
    if (n === 'top') {
      appStore.setCollapse(false)
    }
  }
)
</script>

<template>
  <div :class="prefixCls">
    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.breadcrumb') }}</span>
      <ElSwitch v-model="breadcrumb" @change="breadcrumbChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.breadcrumbIcon') }}</span>
      <ElSwitch v-model="breadcrumbIcon" @change="breadcrumbIconChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.hamburgerIcon') }}</span>
      <ElSwitch v-model="hamburger" @change="hamburgerChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.screenfullIcon') }}</span>
      <ElSwitch v-model="screenfull" @change="screenfullChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.sizeIcon') }}</span>
      <ElSwitch v-model="size" @change="sizeChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.localeIcon') }}</span>
      <ElSwitch v-model="locale" @change="localeChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.tagsView') }}</span>
      <ElSwitch v-model="tagsView" @change="tagsViewChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.tagsViewIcon') }}</span>
      <ElSwitch v-model="tagsViewIcon" @change="tagsViewIconChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.logo') }}</span>
      <ElSwitch v-model="logo" @change="logoChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.uniqueOpened') }}</span>
      <ElSwitch v-model="uniqueOpened" @change="uniqueOpenedChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.fixedHeader') }}</span>
      <ElSwitch v-model="fixedHeader" @change="fixedHeaderChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.footer') }}</span>
      <ElSwitch v-model="footer" @change="footerChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.greyMode') }}</span>
      <ElSwitch v-model="greyMode" @change="greyModeChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.dynamicRouter') }}</span>
      <ElSwitch v-model="dynamicRouter" @change="dynamicRouterChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.serverDynamicRouter') }}</span>
      <ElSwitch v-model="serverDynamicRouter" @change="serverDynamicRouterChange" />
    </div>

    <div class="flex justify-between items-center">
      <span class="text-14px">{{ t('setting.fixedMenu') }}</span>
      <ElSwitch v-model="fixedMenu" @change="fixedMenuChange" />
    </div>
  </div>
</template>
