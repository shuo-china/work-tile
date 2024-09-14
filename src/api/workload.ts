import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'

export interface WorkloadItem {
  id: number
  working_hours_type: number
  task_code: string
  start_time: string
  end_time: string
  duration: number
  describe: string
  manager: {
    name: string
    avatar_str: string
  }
}

export function getWorkloadPaginationApi(
  params?: Record<string, any>,
  options?: AxiosRequestConfig
) {
  return request<Pagination<WorkloadItem>>({
    url: '/workings',
    method: 'get',
    params,
    ...options
  })
}

export function getWorkloadDetailApi(id: number, options?: AxiosRequestConfig) {
  return request<WorkloadItem>({
    url: `/working/detail/${id}`,
    method: 'get',
    ...options
  })
}

export function createWorkloadApi(data: Record<string, any>) {
  return request({
    url: '/working/create',
    method: 'post',
    data
  })
}

export function updateWorkloadApi(data: Record<string, any>) {
  return request({
    url: '/working/update',
    method: 'post',
    data
  })
}

export function batchDeleteWorkloadApi(ids: number[]) {
  return request({
    url: `/working/delete`,
    data: {
      ids: ids.join(',')
    },
    method: 'delete'
  })
}
