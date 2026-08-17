import type { RawAxiosRequestHeaders } from 'axios'

declare global {
  type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

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
}
