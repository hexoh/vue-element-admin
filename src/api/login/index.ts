import request from '../service/index'

export const loginApi = (data: LoginParams) => {
  return request.post<LoginResult>('/api/auth/login', data)
}

export const resetPasswordApi = (data: any): any => {
  return request.put('/api/user/reset/password', data)
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get('/api/auth/logout')
}
