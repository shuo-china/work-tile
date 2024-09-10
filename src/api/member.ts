import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'

export interface MemberItem {
  id: number
  name: string
  avatar_str: string
}

export function getMemberListApi(options?: AxiosRequestConfig) {
  return request<MemberItem[]>({
    url: '/managers',
    method: 'get',
    ...options
  })
}
