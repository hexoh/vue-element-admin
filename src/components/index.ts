import type { App } from 'vue'
import { Permission } from './Permission'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Permission', Permission)
}
