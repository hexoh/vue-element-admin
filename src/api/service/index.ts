import service from './service'

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType, interceptors } = option

  // console.log(`request --- userStore.getToken = ${userStore.getToken}`)
  return service.request({
    url,
    method,
    params,
    data,
    responseType: responseType,
    headers,
    interceptors
  })
}

type RequestConfig = Omit<AxiosConfig, 'url' | 'method'>
type BodyConfig = Omit<RequestConfig, 'params'>

export default {
  get: <T = unknown>(url: string, config?: Omit<RequestConfig, 'data'>) => {
    return request({ url, method: 'get', ...config }) as Promise<IResponse<T>>
  },
  post: <T = unknown>(url: string, data?: unknown, config?: BodyConfig) => {
    return request({ url, method: 'post', data, ...config }) as Promise<IResponse<T>>
  },
  put: <T = unknown>(url: string, data?: unknown, config?: BodyConfig) => {
    return request({ url, method: 'put', data, ...config }) as Promise<IResponse<T>>
  },
  delete: <T = unknown>(url: string, config?: RequestConfig) => {
    return request({ url, method: 'delete', ...config }) as Promise<IResponse<T>>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
