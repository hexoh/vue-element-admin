import request from '../service/index'

export const loginApi = (data: LoginParams) => {
  return request.post<LoginResult>('/mock/user/login', data)
}
