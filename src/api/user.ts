import request from '@/utils/request'

export interface LoginRequestData {
  username: string
  password: string
}

export interface LoginResponseData {
  access_token: string
}

export function loginApi(data: LoginRequestData) {
  return request<LoginResponseData>({
    url: '/login/tokens',
    method: 'post',
    data
  })
}

export interface UserInfoResponseData {
  base_info: {
    id: number
    name: string
    full_path: string
  }
}

export function getUserInfoApi() {
  return request<UserInfoResponseData>({
    url: '/manager',
    method: 'get'
  })
}
