<script setup lang="ts">
import { ConfigGlobal } from './components/config-global'
import { useAppStore } from './stores/modules/app'

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

appStore.initTheme()
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="{ 'is-grey-mode': greyMode }" />
  </ConfigGlobal>
</template>

<style scoped>
.is-grey-mode {
  filter: grayscale(100%);
}
</style>
