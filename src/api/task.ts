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
  task_describe: string
  project: {
    id: number
    project_code: string
    name: string
  }
  manager_id: number
  manager: Nullable<{
    id: number
    name: string
    avatar_str: string
  }>
  manager_member_ids: string
  manager_member_arr: Nullable<
    {
      id: number
      name: string
      avatar_str: string
    }[]
  >
  createManager: {
    id: number
    name: string
    avatar_str: string
  }
  create_time: string
}

export function getTaskPaginationApi(params?: Record<string, any>) {
  return request<Pagination<TaskItem>>({
    url: '/tasks',
    method: 'get',
    params
  })
}

interface TaskOptionItem {
  id: number
  task_code: string
  task_name: string
  task_type: number
}

export function getTaskOptionsApi(projectCode: string) {
  return request<TaskOptionItem[]>({
    url: '/task/select',
    method: 'get',
    params: {
      project_code: projectCode
    }
  })
}

export function createTaskApi(data?: Record<string, any>) {
  return request({
    url: '/task/create',
    method: 'post',
    data
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

export function batchDeleteTaskApi(ids: number[]) {
  return request({
    url: `/task/delete`,
    data: {
      ids: ids.join(',')
    },
    method: 'delete'
  })
}
