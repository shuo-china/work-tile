import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'

interface UploadResponseData {
  name: string
  path: string
  full_path: string
}

export function upload(file: File, options?: AxiosRequestConfig) {
  const form = new FormData()
  form.append('file', file)

  return request<UploadResponseData>({
    url: '/files',
    method: 'post',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...options
  })
}

export function uploadMulti(files: File[], options?: AxiosRequestConfig) {
  return Promise.all(files.map(file => upload(file, options)))
}
