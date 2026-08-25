import type { App } from 'vue'
import { Permission } from './permissions'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Permission', Permission)
}
