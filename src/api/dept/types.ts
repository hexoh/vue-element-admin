export interface DepartmentItem {
  id: string
  departmentName: string
  children?: DepartmentItem[]
}

export interface DepartmentListResponse {
  list: DepartmentItem[]
}

export interface DepartmentUserParams {
  pageSize: number
  pageIndex: number
  orgId?: number
  username?: string
  account?: string
}
export interface OrgListUserParams {
  pageSize: number
  pageIndex: number
  orgId?: number
  adminAreaId?: number
  username?: string
  account?: string
}

export interface RoleItem {
  roleId: number
  roleName: string
}

export interface DepartmentUserItem {
  id: number
  username: string
  realName: string
  adminAreaId?: number
  adminAreaName: string
  orgId?: number
  orgName?: string
  createTime?: string
  roles: RoleItem[] | number[]
}

export interface DepartmentUserResponse {
  list: DepartmentUserItem[]
  totalCount: number
}

export interface CurrentUserInfoResponse {
  username: string
  realName: string
  mobilePhone: string
  fixedPhone: string
  adminAreaName: string
  orgName: string
  roles: RoleItem[]
}

export interface AdminAreaItem {
  id: number
  name: string
  code: string
  parent: number
  lv: number
}

export interface AdminAreaListResponse {
  list: AdminAreaItem[]
}
