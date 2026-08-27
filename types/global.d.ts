import type { RawAxiosRequestHeaders } from 'axios'

declare global {
  interface Fn<T = any> {
    (...arg: T[]): T
  }

  type Nullable<T> = T | null

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  type LocaleType = 'zh-CN' | 'en'

  type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu'

  /** axios content */
  type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain'

  type AxiosMethod = 'get' | 'post' | 'delete' | 'put'

  type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  type Page = {
    pageNum?: number
    pageSize?: number
  }

  interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headers?: RawAxiosRequestHeaders
    responseType?: AxiosResponseType
    interceptors?: AxiosInterceptors
  }

  /** 服务器返回定义 */
  interface IResponse<T = unknown> {
    code: number
    msg?: string
    data: T extends unknown ? T : T & unknown
  }

  /** 服务器返回分页定义 */
  interface IPageResponse<T = unknown> {
    code: number
    msg?: string
    data: {
      list: T extends unknown ? T : T & unknown
      totalCount: number
      totalPage: number
    }
  }

  interface ThemeTypes {
    elColorPrimary?: string
    leftMenuBorderColor?: string
    leftMenuBgColor?: string
    leftMenuBgLightColor?: string
    leftMenuBgActiveColor?: string
    leftMenuCollapseBgActiveColor?: string
    leftMenuTextColor?: string
    leftMenuTextActiveColor?: string
    logoTitleTextColor?: string
    logoBorderColor?: string
    topHeaderBgColor?: string
    topHeaderTextColor?: string
    topHeaderHoverColor?: string
    topToolBorderColor?: string
  }
}
