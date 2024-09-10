<template>
  <div>
    <div class="mb-4 flex justify-end">
      <el-button icon="plus" type="primary">新建项目</el-button>
    </div>
    <div v-loading="loading" class="flex flex-wrap gap-4">
      <el-card
        v-for="item in data"
        :key="item.id"
        class="w-60 cursor-pointer"
        shadow="hover"
        @click="handleClick(item)"
      >
        {{ item.name }}
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProjectListApi, ProjectItem } from '@/api/project'
import useRequest from '@/hooks/useRequest'
import { useUserStore } from '@/store/user'

const router = useRouter()

const { loading, data } = useRequest(getProjectListApi)
const { setCurrentProject } = useUserStore()

const handleClick = (item: ProjectItem) => {
  setCurrentProject(item)
  router.push('/project')
}
</script>

<style lang="scss" scoped></style>
