import { h } from 'vue'
import type { VNode } from 'vue'
import { Icon, type IconTypes } from '@/components/icon'

export const useIcon = (props: IconTypes): VNode => {
  return h(Icon, props)
}
