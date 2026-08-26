interface LoginParams {
  username: string
  password: string
  code?: string
  uuid?: string
}

interface LoginResult {
  username: string
  role: string
  roleId: string
  permissions: string | string[]
}
