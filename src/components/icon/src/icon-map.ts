// 自定义菜单需要提前打包的图标列表或者其他需要提前打包的图标列表
import { type Component, markRaw } from 'vue'
// 预先声明需要打包的 Iconify 图标
import IconEpMenu from '~icons/ep/menu' // 菜单管理
import IconEpUser from '~icons/ep/user' // 用户管理
import IconEpSetting from '~icons/ep/setting' // 系统设置
import IconEpMemo from '~icons/ep/memo' // 部门管理
import IconEpCoin from '~icons/ep/coin' // 角色管理

// 对应数据库字段的映射
export const iconsMap: Record<string, Component> = {
  // EP 图标
  'ep-user': markRaw(IconEpUser),
  'ep-setting': markRaw(IconEpSetting),
  'ep-menu': markRaw(IconEpMenu),
  'ep-memo': markRaw(IconEpMemo),
  'ep-coin': markRaw(IconEpCoin)
}
