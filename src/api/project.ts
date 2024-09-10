import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'

export interface ProjectItem {
  id: number
  name: string
  project_code: string
}

export function getProjectListApi(options?: AxiosRequestConfig) {
  return request<ProjectItem[]>({
    url: '/project/select',
    method: 'get',
    ...options
  })
}
