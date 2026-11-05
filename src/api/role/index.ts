import request from '../service/index'

export const getRoleListApi = (params?: any) => {
  return request.get<any>('/api/role/list', { params })
}

export const updateRoleApi = (data: unknown) => {
  return request.put<object>('/api/role/update', data)
}

export const getRoleDetailApi = (roleId: number) => {
  return request.get<any>(`/api/role/detail/${roleId}`)
}

export const createRoleApi = (data: any) => {
  return request.post<object>('/api/role/add', data)
}

export const deleteRoleApi = (roleId: any) => {
  return request.delete<object>(`/api/role/delete/${roleId}`)
}
