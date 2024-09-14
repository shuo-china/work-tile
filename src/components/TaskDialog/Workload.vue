<template>
  <div
    v-show="!selectionRows.length"
    class="mb-3 h-10 flex flex-shrink-0 items-center justify-between rounded bg-black/3 px-6 text-sm"
  >
    <div class="flex items-center text-black/50">
      <el-input
        prefix-icon="Search"
        placeholder="搜索登记人"
        class="search-name"
        :model-value="name"
        @update:model-value="handleUpdateName"
      />
      <el-divider direction="vertical" class="mx-6!" />
      <div class="flex-shrink-0">登记 {{ total }} 次</div>
    </div>
    <div class="flex items-center">
      <div
        class="flex cursor-pointer items-center gap-x-1 pl-2 text-[var(--el-color-primary)] hover:text-[var(--el-color-primary-light-3)]"
        @click="workloadDialogVisible = true"
      >
        <el-icon><Plus /></el-icon>
        登记工时
      </div>
    </div>
  </div>

  <div
    v-show="selectionRows.length"
    class="mb-3 h-10 flex flex-shrink-0 items-center justify-between rounded bg-black/3 px-6 text-sm"
  >
    <div class="flex items-center text-black/50">
      <div>已选 {{ selectionRows.length }} 项</div>
      <div
        class="cursor-pointer pl-2 text-[var(--el-color-primary)] hover:text-[var(--el-color-primary-light-3)]"
        @click="() => tableRef?.clearSelection()"
      >
        取消选择
      </div>
    </div>
    <div>
      <div
        class="cursor-pointer pl-2 text-[var(--el-color-primary)] hover:text-[var(--el-color-primary-light-3)]"
        @click="handleBatchDel"
      >
        批量删除
      </div>
    </div>
  </div>

  <div class="overflow-auto">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :border="true"
      :show-overflow-tooltip="true"
      row-class-name="cursor-pointer"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="duration" label="工作时长(小时)" :width="150"></el-table-column>
      <el-table-column prop="working_hours_type" label="工时类别" :width="120">
        <template #default="{ row }">
          <div class="flex items-center gap-x-2">
            <div
              class="h-2 w-2"
              :style="{ background: workloadTypeMappings[row.working_hours_type].color }"
            ></div>
            {{ workloadTypeMappings[row.working_hours_type].text }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="描述">
        <template #default="{ row }">
          <div class="truncate">
            {{ row.describe }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="manager.name" label="登记人" :width="140">
        <template #default="{ row }">
          <div class="flex items-center gap-x-2">
            <el-avatar :src="row.avatar_str" :size="24" class="flex-shrink-0" />
            <div class="truncate">
              {{ row.manager.name }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="working_date" label="工作日期" :width="120"></el-table-column>
    </el-table>
    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        size="small"
        layout="prev, pager, next, sizes, total"
        :background="true"
      />
    </div>
  </div>
  <WorkloadDialog
    v-model="workloadDialogVisible"
    :workload-id="workloadId"
    :task-code="data?.task_code"
    @submit-success="paging"
    @closed="workloadId = undefined"
  />
</template>

<script setup lang="ts">
import { TaskItem } from '@/api/task'
import { batchDeleteWorkloadApi, getWorkloadPaginationApi, WorkloadItem } from '@/api/workload'
import usePagination from '@/hooks/usePagination'
import { workloadTypeMappings } from '@/utils/mappings'
import { Action, TableInstance } from 'element-plus'

const tableRef = ref<TableInstance>()

const data = defineModel<TaskItem>()

const selectionRows = ref<WorkloadItem[]>([])
const handleSelectionChange = (rows: WorkloadItem[]) => {
  selectionRows.value = rows
}

const workloadId = ref<number>()

const workloadDialogVisible = ref(false)

const handleRowClick = (row: WorkloadItem, column: any) => {
  if (column.type === 'selection') return
  workloadId.value = row.id
  workloadDialogVisible.value = true
}

const {
  data: list,
  loading,
  currentPage,
  pageSize,
  total,
  search,
  paging
} = usePagination(getWorkloadPaginationApi, {
  defaultParams: [
    {
      task_code: data.value?.task_code
    }
  ]
})

const name = ref('')
const handleUpdateName = (v: string) => {
  name.value = v
  search({
    name: v
  })
}

const handleBatchDel = () => {
  ElMessageBox.confirm(`确定要删除工时吗？删除后不可恢复`, '删除工时', {
    type: 'error',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        await batchDeleteWorkloadApi(selectionRows.value.map(i => i.id))
        paging()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.search-name :deep(.el-input__wrapper) {
  box-shadow: none;
  background-color: transparent;
  padding: 0;
}
</style>
