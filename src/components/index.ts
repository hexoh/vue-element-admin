import type { App } from 'vue'
import { Permission } from './permission'
import { Icon } from './icon'
import { BaseButton } from './button'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('Permission', Permission)
  app.component('BaseButton', BaseButton)
}
