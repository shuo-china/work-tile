import request from '@/utils/request'

export interface TaskItem {
  id: number
  task_name: string
  task_type: number
  project_code: string
  task_code: string
  current_status: number
  level_status: number
  start_time: string
  end_time: string
  project: {
    id: number
    project_code: string
    name: string
  }
  manager_id: number
  manager: {
    id: number
    name: string
    avatar_str: string
  }
}

export function getTaskPaginationApi(params?: Record<string, any>) {
  return request<Pagination<TaskItem>>({
    url: '/tasks',
    method: 'get',
    params
  })
}

export function updateTaskApi(data?: Record<string, any>) {
  return request({
    url: '/task/update',
    method: 'post',
    data
  })
}

export function getTaskDetailApi(id: number) {
  return request<TaskItem>({
    url: `/task/detail/${id}`,
    method: 'get'
  })
}
