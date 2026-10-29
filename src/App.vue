<script setup lang="ts">
import { ConfigGlobal } from './components/config-global'
import { useDesign } from './hooks/web/useDesign'
import { useAppStore } from './stores/modules/app'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

appStore.initTheme()
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="scss">
$prefix-cls: '#{adminNamespace}-app';

@mixin size {
  width: 100%;
  height: 100%;
}

html,
body {
  @include size;

  padding: 0 !important;
  margin: 0;
  overflow: hidden;

  #app {
    @include size;
  }
}

.#{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
