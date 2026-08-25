import type { App } from 'vue'
import { Permission } from './permission'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Permission', Permission)
}
