<script setup lang="ts">
import { ImageCropping } from '@/components/image-cropping'
import { ref, unref } from 'vue'

defineProps({
  url: {
    type: String,
    default: ''
  }
})

const fileUrl = ref('')

const CropperRef = ref<ComponentRef<typeof ImageCropping>>()

const getBase64 = async () => {
  return (await unref(CropperRef)?.getBase64()) ?? ''
}

defineExpose({
  getBase64
})
</script>

<template>
  <div>
    <ImageCropping ref="CropperRef" :image-url="fileUrl || url" />
  </div>
</template>
