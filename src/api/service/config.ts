import type { AxiosResponse, InternalAxiosRequestConfig } from './types'
import { ElMessage } from 'element-plus'
import qs from 'qs'
import { SUCCESS_CODE, TRANSFORM_REQUEST_DATA, CONTENT_TYPE } from '@/constants'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { objToFormData } from '@/utils'

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  // 1. 处理 Content-Type 和 Token
  const userStore = useUserStoreWithOut()
  const tokenKey = userStore.getTokenKey ?? 'Authorization'
  const token = userStore.getToken

  if (token) {
    config.headers[tokenKey] = `Bearer ${token}`
  }

  // 如果当前请求没有设置 Content-Type，且有 data 数据，且不是 FormData，则默认给个 json
  if (!config.headers['Content-Type']) {
    if (config.data instanceof FormData) {
      // 如果是 FormData，千万不要手动设置 Content-Type，让浏览器自己去填带 boundary 的类型
      delete config.headers['Content-Type']
    } else {
      // 普通请求默认走 JSON
      config.headers['Content-Type'] = CONTENT_TYPE
    }
  }

  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data' &&
    !(config.data instanceof FormData)
  ) {
    config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  } else if (response.data.code === SUCCESS_CODE) {
    return response.data
  } else {
    ElMessage.error(response?.data?.msg)
    if (response?.data?.code === 401) {
      const userStore = useUserStoreWithOut()
      userStore.logout()
    }
    return Promise.reject(response.data)
  }
}

export { defaultResponseInterceptors, defaultRequestInterceptors }
