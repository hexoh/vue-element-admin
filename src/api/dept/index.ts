import request from '../service/index'
import type {
  DepartmentListResponse,
  DepartmentUserParams,
  DepartmentUserResponse,
  AdminAreaListResponse,
  CurrentUserInfoResponse
} from './types'

export const getDepartmentApi = () => {
  return request.get<DepartmentListResponse>('/api/org/list_nopaging')
}

export const getUserByIdApi = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>('/mock/department/users', { params })
}

export const getUserListApi = (params: any) => {
  return request.get<DepartmentUserResponse>('/api/user/list', { params })
}

export const getUserInfoApi = () => {
  return request.get<CurrentUserInfoResponse>('/api/user/getCurUserInfo')
}

export const updateUserInfoApi = (data: unknown) => {
  return request.put('/api/user/updateUserInfo', data)
}

export const deleteUserByIdApi = (ids: string[] | number[]) => {
  return request.delete(`/api/user/deleteUsers?ids=${ids.join(',')}`)
}

export const saveUserApi = (data: any) => {
  return request.post('/api/user/save', data)
}

export const saveDepartmentApi = (data: any) => {
  return request.post('/api/org/save', data)
}

export const deleteDepartmentApi = (ids: string[] | number[]) => {
  return request.delete('/api/org/delete', { data: ids })
}

export const getDepartmentTableApi = (params: any) => {
  return request.get<any>('/api/org/list', { params })
}

export const getAdminAreaApi = (parent?: number) => {
  let url = `/api/org/adminAreaList`
  if (parent !== undefined && parent !== null) {
    url = url + `?parent=${parent}`
  }
  return request.get<AdminAreaListResponse>(url)
}

export const getCurrentAdminArea = () => {
  return request.get<any>('/api/user/getCurrentAdminArea')
}
