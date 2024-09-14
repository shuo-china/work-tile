import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'

export interface Annex {
  id: number
  file_id: number
  erp_id: number
  name: string
  type: number
  file_str: string
  create_time: string
  file_type: number
  createManager: {
    id: number
    name: string
  }
}

export function getAnnexListApi(params?: Record<string, any>, options?: AxiosRequestConfig) {
  return request<Annex[]>({
    url: '/erp_file',
    method: 'get',
    params,
    ...options
  })
}

export function createAnnexApi(data?: Record<string, any>, options?: AxiosRequestConfig) {
  return request<Annex[]>({
    url: '/erp_file/create',
    method: 'post',
    data,
    ...options
  })
}

export function deleteAnnexApi(id: number, options?: AxiosRequestConfig) {
  return request<Annex[]>({
    url: `/erp_file/delete/${id}`,
    method: 'delete',
    ...options
  })
}
