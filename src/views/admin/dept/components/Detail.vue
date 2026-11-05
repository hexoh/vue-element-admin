<script setup lang="ts">
import { type PropType } from 'vue'
import type { DepartmentItem } from '@/api/dept/types'
import { Descriptions, type DescriptionsSchema } from '@/components/descriptions'

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DepartmentItem>>,
    default: () => null
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
