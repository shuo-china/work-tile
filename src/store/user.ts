import { defineStore } from 'pinia'
import { StoreId } from '@/utils/enums'
import { getUserInfoApi, loginApi, LoginRequestData } from '@/api/user'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { CURRENT_PROJECT_KEY, TOKEN_KEY } from '@/utils/constants'
import { ProjectItem } from '@/api/project'

export interface CurrentProject {
  id: number
  name: string
  projectCode: string
}

export interface UserInfo {
  id: number
  name: string
  roles: string[]
}

export const useUserStore = defineStore(StoreId.User, () => {
  const token = useLocalStorage<Nullable<string>>(TOKEN_KEY, null)
  const userInfo = ref<Nullable<UserInfo>>(null)
  const currentProject = useLocalStorage<Nullable<CurrentProject>>(CURRENT_PROJECT_KEY, null, {
    serializer: StorageSerializers.object
  })

  const hasUserInfo = computed(() => userInfo.value !== null)

  const login = async (data: LoginRequestData) => {
    const result = await loginApi(data)
    token.value = result.access_token
  }

  const getUserInfo = async () => {
    const {
      base_info: { id, name }
    } = await getUserInfoApi()
    userInfo.value = {
      id,
      name,
      roles: []
    }
  }

  const logout = () => {
    token.value = null
    userInfo.value = null
  }

  const setCurrentProject = (value: ProjectItem) => {
    currentProject.value = {
      id: value.id,
      name: value.name,
      projectCode: value.project_code
    }
  }

  return {
    token,
    userInfo,
    hasUserInfo,
    currentProject,
    login,
    setCurrentProject,
    getUserInfo,
    logout
  }
})
