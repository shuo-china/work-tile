<template>
  <div>
    <div class="mb-4 flex justify-end">
      <el-button icon="plus" type="primary" @click="handleCreate">新建项目</el-button>
    </div>
    <div v-loading="loading" class="flex flex-wrap gap-5">
      <el-card
        v-for="item in data"
        :key="item.id"
        class="w-60"
        body-class="h-full flex flex-col p-0!"
        shadow="hover"
      >
        <div class="h-30 grow cursor-pointer" @click="handleClickItem(item)">
          <img src="/default_cover.png" class="h-full w-full" />
        </div>
        <div class="h-11 flex flex items-center justify-between pl-4 pr-2 text-sm">
          <div>{{ item.name }}</div>
          <el-dropdown trigger="click" :show-arrow="false" popper-class="w-20">
            <div
              class="cursor-pointer rounded px-2 py-1.5 outline-none hover:bg-black/5 hover:text-[var(--el-color-primary)]"
            >
              <el-icon>
                <MoreFilled />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="Edit" @click="handleEdit(item)">编辑</el-dropdown-item>
                <el-dropdown-item icon="Delete" @click="handleDelete(item)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-card>
    </div>
    <ProjectDialog
      v-model="projectDialogVisible"
      :project-id="editProjectId"
      @submit-success="run"
    />
  </div>
</template>

<script setup lang="ts">
import ProjectDialog from './ProjectDialog.vue'
import { deleteProjectApi, getProjectListApi, ProjectItem } from '@/api/project'
import useRequest from '@/hooks/useRequest'
import { useUserStore } from '@/store/user'
import { Action } from 'element-plus'

const router = useRouter()
const projectDialogVisible = ref(false)
const editProjectId = ref()

const { loading, data, run } = useRequest(getProjectListApi)
const { setCurrentProject } = useUserStore()

const handleCreate = () => {
  editProjectId.value = undefined
  projectDialogVisible.value = true
  run()
}

const handleEdit = (item: ProjectItem) => {
  editProjectId.value = item.id
  projectDialogVisible.value = true
  run()
}

const handleDelete = (item: ProjectItem) => {
  ElMessageBox.confirm(`确定要删除项目吗？删除后不可恢复`, '删除项目', {
    type: 'error',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        await deleteProjectApi(item.id)
        run()
      }
    }
  })
}

const handleClickItem = (item: ProjectItem) => {
  setCurrentProject(item)
  router.push('/project')
}
</script>

<style lang="scss" scoped></style>
