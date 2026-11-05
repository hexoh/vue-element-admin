import request from '../service/index'

export const getMenuListApi = () => {
  return request.get<any>('/api/permission/list')
}

export const updateMenuListApi = (data: unknown) => {
  return request.put<any>('/api/permission/update', data)
}

export const addMenuListApi = (data: unknown) => {
  return request.post<any>('/api/permission/add', data)
}

export const deleteMenuApi = (permissionId: any) => {
  return request.delete<any>(`/api/permission/delete/${permissionId}`)
}
