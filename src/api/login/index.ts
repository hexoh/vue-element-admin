import request from '../service/index'

export const loginApi = (data: LoginParams) => {
  return request.post<LoginResult>('/mock/user/login', data)
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get('/mock/user/loginOut')
}
