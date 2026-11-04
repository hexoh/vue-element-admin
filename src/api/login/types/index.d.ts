interface LoginParams {
  username: string
  password: string
  code?: string
  uuid?: string
}

interface LoginResult {
  access_token: string
  refresh_token: string
  userInfo: any
  permissions: any[]
}
