<script setup lang="ts">
import { shallowRef, markRaw, watchEffect, computed } from 'vue'
import { ElIcon } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { Icon } from '@iconify/vue'
import { ICON_PREFIX } from '@/constants'
import { iconsMap } from './icon-map'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('icon')

const props = defineProps({
  // icon name
  icon: propTypes.string,
  // icon color
  color: propTypes.string,
  // icon size
  size: propTypes.number.def(16),
  hoverColor: propTypes.string
})

const isLocal = computed(() => props.icon.startsWith('svg-icon:'))

const localIcons = import.meta.glob<Record<string, { default: any }>>('~icons/local/*')

const localComponent = shallowRef()

const resolveLocalIcon = async (icon: string) => {
  const name = icon.replace('svg-icon:', '')
  const mod = await localIcons[`~icons/local/${name}`]?.()
  if (mod?.default) localComponent.value = markRaw(mod.default)
}

const offlineComponent = computed(() => iconsMap[props.icon])

watchEffect(() => {
  if (isLocal.value && props.icon) {
    resolveLocalIcon(props.icon)
  }
})

// 是否使用在线图标
const isUseOnline = computed(() => {
  return import.meta.env.VITE_USE_ONLINE_ICON === 'true'
})

const getIconifyStyle = computed(() => {
  const { color, size } = props
  return {
    fontSize: `${size}px`,
    color
  }
})

const getIconName = computed(() => {
  return props.icon.startsWith(ICON_PREFIX) ? props.icon.replace(ICON_PREFIX, '') : props.icon
})
</script>

<template>
  <ElIcon :class="prefixCls" :size="size" :color="color">
    <component v-if="isLocal && localComponent" :is="localComponent" />

    <!-- 预定义的离线组件 (icon-map.ts 里的图标) -->
    <component v-else-if="offlineComponent" :is="offlineComponent" :style="getIconifyStyle" />

    <template v-else>
      <Icon v-if="isUseOnline" :icon="getIconName" :style="getIconifyStyle" />
      <div v-else :class="`${icon} iconify`" :style="getIconifyStyle"></div>
    </template>
  </ElIcon>
</template>

<style scoped>
.v-icon,
.iconify {
  :deep(svg) {
    &:hover {
      color: v-bind(hovercolor) !important;
    }
  }
}

.iconify {
  &:hover {
    color: v-bind(hovercolor) !important;
  }
}
</style>
