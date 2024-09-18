import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'

export interface ProjectItem {
  id: number
  name: string
  project_code: string
  project_image: number
  project_image_str: string
  start_time: string
  end_time: string
  project_describe: string
  manager_id: number
  manager: Nullable<{
    id: number
    name: string
    avatar_str: string
  }>
  manager_member_ids: string
  manager_member_arr: {
    id: number
    name: string
    avatar_str: string
  }[]
}

export function getProjectListApi(options?: AxiosRequestConfig) {
  return request<ProjectItem[]>({
    url: '/project/select',
    method: 'get',
    ...options
  })
}

export function getProjectDetailApi(id: number, options?: AxiosRequestConfig) {
  return request<ProjectItem>({
    url: `/project/detail/${id}`,
    method: 'get',
    ...options
  })
}

export function createProjectApi(data: Record<string, any>) {
  return request({
    url: '/project/create',
    method: 'post',
    data
  })
}

export function updateProjectApi(data: Record<string, any>) {
  return request({
    url: '/project/update',
    method: 'post',
    data
  })
}

export function deleteProjectApi(id: number) {
  return request({
    url: `/project/delete/${id}`,
    method: 'delete'
  })
}
