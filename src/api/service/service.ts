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

const handleRequestError = (error: AxiosError) => {
  // 主动取消或被动取消的错误，不弹窗
  if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
    return
  }

  // 请求超时
  if (error.code === 'ECONNABORTED') {
    ElMessage.error('请求超时，请稍后重试')
    return
  }

  // 无响应（网络层错误）
  if (!error.response) {
    if (navigator.onLine) {
      ElMessage.error('网络异常，请检查后端服务后重试')
    } else {
      ElMessage.error('网络异常，请检查本地网络后重试')
    }
    return
  }

  const status = error.response.status
  const data = error.response.data as { msg?: string }
  const message = data?.msg || error.message

  if (status === 401) {
    ElMessage.error('登录已过期，请重新登录')
  } else if (status === 403) {
    ElMessage.error('无权限访问')
  } else if (status === 404) {
    ElMessage.error('请求资源不存在')
  } else if (status >= 500) {
    ElMessage.error('服务器异常，请稍后重试')
  } else {
    ElMessage.error(message)
  }
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
      handleRequestError(error)
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
