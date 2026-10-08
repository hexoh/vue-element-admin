<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { nextTick, unref, ref, watch, onBeforeUnmount, onMounted, computed } from 'vue'
import Cropper from 'cropperjs'
import { ElDivider, ElUpload, type UploadFile, ElMessage, ElTooltip } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'
import { BaseButton } from '@/components/button'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('image-cropping')

const props = defineProps({
  imageUrl: {
    type: String,
    default: '',
    required: false
  },
  cropBoxWidth: {
    type: Number,
    default: 200
  },
  cropBoxHeight: {
    type: Number,
    default: 200
  },
  boxWidth: {
    type: [Number, String],
    default: 425
  },
  boxHeight: {
    type: [Number, String],
    default: 320
  },
  showResult: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const getBase64 = useDebounceFn(async () => {
  const selection = unref(cropperRef)?.getCropperSelection()
  if (!selection) return
  try {
    const canvas = await selection.$toCanvas()
    imgBase64.value = canvas?.toDataURL() ?? ''
  } catch (error) {
    console.error('获取截屏失败:', error)
  }
}, 80)

const resetCropBox = () => {
  const selection = unref(cropperRef)?.getCropperSelection()
  if (selection) {
    selection.width = props.cropBoxWidth
    selection.height = props.cropBoxHeight
    selection.aspectRatio = 1
    selection.$center()
  }
  getBase64()
}

const getBoxStyle = computed(() => {
  return {
    width: `${props.boxWidth}px`,
    height: `${props.boxHeight}px`
  }
})

const getCropBoxStyle = computed(() => {
  return {
    width: `${props.cropBoxWidth}px`,
    height: `${props.cropBoxHeight}px`
  }
})

// 获取对应的缩小倍数的宽高
const getScaleSize = (scale: number) => {
  return {
    width: props.cropBoxWidth * scale + 'px',
    height: props.cropBoxHeight * scale + 'px'
  }
}

const imgBase64 = ref('')
const imgRef = ref<HTMLImageElement>()
const cropperRef = ref<Cropper>()

const intiCropper = () => {
  if (!unref(imgRef)) return
  const imgEl = unref(imgRef)!

  cropperRef.value = new Cropper(imgEl)

  // 监听选区变化以更新 base64
  const selection = cropperRef.value.getCropperSelection()
  if (selection) {
    selection.aspectRatio = 1
    // 选区变化时重新获取 base64
    selection.addEventListener('change', getBase64)
  }

  // 初始加载一次预览
  nextTick(() => {
    resetCropBox()
  })
}

// 替换图片方法
const replaceImage = (url: string) => {
  const image = unref(cropperRef)?.getCropperImage()
  if (image) {
    image.src = url
    nextTick(() => {
      resetCropBox()
    })
  }
}

const uploadChange = (uploadFile: UploadFile) => {
  // 判断是否是图片
  if (uploadFile?.raw?.type.indexOf('image') === -1) {
    ElMessage.error('请上传图片格式的文件')
    return
  }
  if (!uploadFile.raw) return
  // 获取图片的访问地址
  const url = URL.createObjectURL(uploadFile.raw)
  replaceImage(url)
}

const reset = () => {
  unref(cropperRef)?.getCropperSelection()?.$reset()
  resetCropBox()
}

const rotate = (deg: number) => {
  unref(cropperRef)?.getCropperImage()?.$rotate(deg)
  getBase64()
}

const scaleX = ref(1)
const scaleY = ref(1)
const scale = (type: 'scaleX' | 'scaleY') => {
  const image = unref(cropperRef)?.getCropperImage()
  if (!image) return

  if (type === 'scaleX') {
    scaleX.value = scaleX.value === 1 ? -1 : 1
  } else {
    scaleY.value = scaleY.value === 1 ? -1 : 1
  }

  // 2.x 使用 $scale(x, y)
  image.$scale(scaleX.value, scaleY.value)
  getBase64()
}

const zoom = (num: number) => {
  unref(cropperRef)?.getCropperImage()?.$zoom(num)
  getBase64()
}

onMounted(() => {
  intiCropper()
})

watch(
  () => props.imageUrl,
  (url) => {
    if (url) {
      replaceImage(url)
    }
  }
)

onBeforeUnmount(() => {
  unref(cropperRef)?.destroy()
})

defineExpose({
  cropperExpose: cropperRef
})
</script>

<template>
  <div
    :class="{
      [prefixCls]: true,
      'flex items-center': showResult
    }"
  >
    <div>
      <div :style="getBoxStyle" class="flex justify-center items-center">
        <img
          v-show="imageUrl"
          ref="imgRef"
          :src="imageUrl"
          class="block max-w-full"
          crossorigin="anonymous"
          alt=""
          srcset=""
        />
      </div>
      <div v-if="showActions" class="mt-10px flex items-center">
        <div class="flex items-center">
          <ElTooltip content="选择文件" placement="bottom">
            <ElUpload
              action="''"
              accept="image/*"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="uploadChange"
            >
              <BaseButton size="small" type="primary" class="mt-2px"
                ><Icon icon="vi-ep:upload-filled"
              /></BaseButton>
            </ElUpload>
          </ElTooltip>
        </div>
        <div class="flex items-center justify-end flex-1">
          <ElTooltip content="重置" placement="bottom">
            <BaseButton size="small" type="primary" @click="reset"
              ><Icon icon="vi-ep:refresh"
            /></BaseButton>
          </ElTooltip>
          <ElTooltip content="逆时针旋转" placement="bottom">
            <BaseButton size="small" type="primary" @click="rotate(-45)"
              ><Icon icon="vi-ant-design:rotate-left-outlined"
            /></BaseButton>
          </ElTooltip>
          <ElTooltip content="顺时针旋转" placement="bottom">
            <BaseButton size="small" type="primary" @click="rotate(45)"
              ><Icon icon="vi-ant-design:rotate-right-outlined"
            /></BaseButton>
          </ElTooltip>
          <ElTooltip content="水平翻转" placement="bottom">
            <BaseButton size="small" type="primary" @click="scale('scaleX')"
              ><Icon icon="vi-vaadin:arrows-long-h"
            /></BaseButton>
          </ElTooltip>
          <ElTooltip content="垂直翻转" placement="bottom">
            <BaseButton size="small" type="primary" @click="scale('scaleY')"
              ><Icon icon="vi-vaadin:arrows-long-v"
            /></BaseButton>
          </ElTooltip>
          <ElTooltip content="放大" placement="bottom">
            <BaseButton size="small" type="primary" @click="zoom(0.1)"
              ><Icon icon="vi-ant-design:zoom-in-outlined"
            /></BaseButton>
          </ElTooltip>
          <ElTooltip content="缩小" placement="bottom">
            <BaseButton size="small" type="primary" @click="zoom(-0.1)"
              ><Icon icon="vi-ant-design:zoom-out-outlined"
            /></BaseButton>
          </ElTooltip>
        </div>
      </div>
    </div>
    <div v-if="imgBase64 && showResult" class="ml-20px">
      <div class="flex justify-center items-center">
        <img :src="imgBase64" class="rounded-[50%]" :style="getCropBoxStyle" />
      </div>
      <ElDivider />
      <div class="flex justify-center items-center">
        <img :src="imgBase64" class="rounded-[50%]" :style="getScaleSize(0.2)" />
        <img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.25)" />
        <img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.3)" />
        <img :src="imgBase64" class="rounded-[50%] ml-20px" :style="getScaleSize(0.35)" />
      </div>
    </div>
  </div>
</template>
