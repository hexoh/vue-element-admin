import axios, { AxiosError } from 'axios'
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config'
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  RequestConfig,
  AxiosResponse
} from './types'
import { REQUEST_TIMEOUT } from '@/constants'
import { ElMessage } from 'element-plus'

export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

// 生成唯一的请求 Key
const getPendingKey = (config: InternalAxiosRequestConfig): string => {
  const url = config.url || ''
  const mockPrefix = import.meta.env.VITE_USE_MOCK === 'true' ? url.replace('/mock', '') : url
  return [config.method, mockPrefix].join('&')
}

const abortControllerMap: Map<string, AbortController> = new Map()

const axiosInstance: AxiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  baseURL: PATH_URL
})

axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const controller = new AbortController()
  res.signal = controller.signal

  const pendingKey = getPendingKey(res)
  abortControllerMap.set(pendingKey, controller)
  return res
})

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const pendingKey = getPendingKey(res.config)
    abortControllerMap.delete(pendingKey)
    // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
    return res
  },
  (error: AxiosError) => {
    if (error.config) {
      const pendingKey = getPendingKey(error.config as InternalAxiosRequestConfig)
      abortControllerMap.delete(pendingKey)
    }

    // 过滤掉主动取消的错误，避免弹窗报错
    if (!axios.isCancel(error)) {
      console.log('err: ' + error)
      ElMessage.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.request.use(defaultRequestInterceptors)
axiosInstance.interceptors.response.use(defaultResponseInterceptors)

const service = {
  request: (config: RequestConfig) => {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any)
      }

      axiosInstance
        .request(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  },
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      // 遍历 map，只要包含该 url 的就将其 abort
      for (const [key, controller] of abortControllerMap) {
        if (key.includes(_url)) {
          controller.abort()
          abortControllerMap.delete(key)
        }
      }
    }
  },
  cancelAllRequest() {
    for (const [_, controller] of abortControllerMap) {
      controller.abort()
    }
    abortControllerMap.clear()
  }
}

export default service
