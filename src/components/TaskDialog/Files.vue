<template>
  <div class="mb-2 flex justify-between text-black/50">
    <div>共 {{ list?.length }} 个附件</div>
    <ProUpload type="file" :show-file-list="false" @success="handleUploadSuccess">
      <div class="flex items-center gap-x-1 hover:text-[var(--el-color-primary)]">
        <el-icon><Plus /></el-icon>添加附件
      </div>
    </ProUpload>
  </div>
  <div class="overflow-auto">
    <div
      v-for="item in list"
      :key="item.id"
      class="group flex items-center justify-between border-0 border-b-1 border-black/5 border-solid py-4 last-of-type:border-0"
    >
      <div class="flex items-center">
        <div>
          <el-image class="h-[50px] w-[110px]" :src="item.file_str" fit="cover">
            <template #error>
              <div
                class="h-full flex items-center justify-center border border-black/10 rounded border-solid"
              >
                <el-icon :size="26" class="text-black/30"><Files /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="ml-5">
          <div class="text-sm">{{ item.name }}</div>
          <div class="mt-1.5 flex items-center text-xs text-black/50">
            来自 {{ item.createManager.name }}
            <el-divider direction="vertical" />
            {{ item.create_time }}
          </div>
        </div>
      </div>
      <div class="hidden gap-x-4 pr-4 text-black/50 group-hover:flex">
        <el-tooltip effect="dark" content="下载" placement="top">
          <el-icon
            :size="18"
            class="cursor-pointer hover:text-[var(--el-color-primary)]"
            @click="download(item.file_id, item.name)"
            ><Download
          /></el-icon>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top">
          <el-icon
            :size="18"
            class="cursor-pointer hover:text-[var(--el-color-danger)]"
            @click="handleDeleteFile(item)"
            ><Delete
          /></el-icon>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAnnexListApi, createAnnexApi, Annex, deleteAnnexApi } from '@/api/annex'
import useRequest from '@/hooks/useRequest'
import { FileItem } from '../ProUpload/props'
import { TaskItem } from '@/api/task'
import { Action } from 'element-plus'
import { download } from '@/utils'

const data = defineModel<TaskItem>()

const { run, data: list } = useRequest(getAnnexListApi, {
  defaultParams: [
    {
      type: 2
    }
  ]
})

const fetchList = () => run({ type: 2 })

const handleUploadSuccess = async (file: FileItem) => {
  await createAnnexApi({
    file_id: file.id,
    erp_id: data.value?.id,
    name: file.name,
    type: 2
  })
  fetchList()
}

const handleDeleteFile = (annex: Annex) => {
  ElMessageBox.confirm(`附件删除后不可恢复，确定要删除 ${annex.name} 吗？`, '删除任务', {
    type: 'error',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        await deleteAnnexApi(annex.id)
        await fetchList()
      }
    }
  })
}
</script>

<style lang="scss" scoped></style>
