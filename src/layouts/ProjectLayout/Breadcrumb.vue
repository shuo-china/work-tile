<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <el-dropdown placement="bottom-start" trigger="click" @visible-change="handleVisibleChange">
        <div
          class="flex cursor-pointer items-center outline-none hover:text-[var(--el-color-primary)]"
        >
          {{ currentProject?.name }}
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu v-loading="loading">
            <el-dropdown-item v-for="item in data" :key="item.id" @click="handleClickItem(item)">{{
              item.name
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { getProjectListApi, ProjectItem } from '@/api/project'
import useRequest from '@/hooks/useRequest'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const { currentProject } = storeToRefs(userStore)
const { setCurrentProject } = userStore

const { run, data, loading } = useRequest(getProjectListApi, { manual: true })

const handleClickItem = (item: ProjectItem) => {
  if (item.id !== currentProject.value?.id) {
    setCurrentProject(item)
    router.go(0)
  }
}

const handleVisibleChange = (visible: boolean) => {
  if (visible) {
    run()
  }
}
</script>
