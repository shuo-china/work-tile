<template>
  <div class="relative mb-6">
    <el-tabs
      :model-value="activeName"
      class="flex-grow"
      @update:model-value="handleUpdateModelValue"
    >
      <el-tab-pane label="全部任务" name="all"></el-tab-pane>
      <el-tab-pane label="我负责的任务" name="resp"></el-tab-pane>
      <el-tab-pane label="我参与的任务" name="join"></el-tab-pane>
      <el-tab-pane label="我创建的任务" name="create"></el-tab-pane>
    </el-tabs>
    <el-button
      type="primary"
      class="absolute bottom-1 right-0"
      icon="plus"
      @click="addTaskDialogVisible = true"
      >新建</el-button
    >
  </div>

  <div
    v-show="selectionRows.length"
    class="mb-3 flex justify-between rounded bg-black/3 px-6 py-3 text-sm"
  >
    <div class="flex text-black/50">
      <div>已选 {{ selectionRows.length }} 项</div>
      <div
        class="cursor-pointer pl-2 text-[var(--el-color-primary)] hover:text-[var(--el-color-primary-light-3)]"
        @click="() => tableRef.getInstance().clearSelection()"
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
  <ProTable
    ref="tableRef"
    :request="getTaskPaginationApi"
    row-class-name="cursor-pointer"
    :request-options="requestOptions"
    size="large"
    :table-card-border="false"
    :border="true"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <ProTableColumn type="selection"></ProTableColumn>
    <ProTableColumn prop="task_name" label="标题" min-width="500" fixed="left">
      <template #default="{ row }">
        <div v-if="editableTitleRow?.id === row.id" class="absolute inset-0">
          <input
            v-model="editableTitleRow!.task_name"
            v-focus
            class="title-input h-full w-full border-none px-4 outline-none"
            @keydown.enter="handleChangeTitle"
            @blur="handleChangeTitle"
            @click.stop
          />
        </div>
        <div v-else class="group absolute inset-0 flex flex items-center px-4">
          <div class="flex-grow-1 truncate">{{ row.task_name }}</div>
          <div class="w-8 flex-shrink-0">
            <el-tooltip content="编辑" placement="top" :enterable="false" :hide-after="0">
              <div
                class="hidden h-8 w-8 items-center justify-center rounded group-hover:flex hover:bg-black/7 hover:text-[var(--el-color-primary)]"
                @click.stop="handleClickEditTitle(row)"
              >
                <el-icon size="18">
                  <Edit />
                </el-icon>
              </div>
            </el-tooltip>
          </div>
        </div>
      </template>
    </ProTableColumn>
    <ProTableColumn prop="task_code" label="编号" width="160"></ProTableColumn>
    <ProTableColumn prop="current_status" label="状态" width="140" sortable="custom">
      <template #default="{ row }">
        <div
          :class="[
            'group flex justify-between table-col-clickable',
            currentClickedRow?.id === row.id && !statusPopoverDisappear ? 'bg-black/5' : ''
          ]"
          @click.stop="() => (currentClickedRow = row)"
          @mouseenter="
            ({ currentTarget }) => {
              statusPopoverDisappear && (statusPopoverVirtualRef = currentTarget)
              currentStatusPopoverRef = currentTarget
            }
          "
        >
          <StatusButton v-if="row.current_status" :data="taskStatusMappings[row.current_status]" />
          <el-icon v-if="currentClickedRow?.id === row.id && !statusPopoverDisappear" size="16">
            <ArrowUp />
          </el-icon>
          <el-icon v-else class="hidden group-hover:block" size="16" @mouseenter.stop>
            <ArrowDown />
          </el-icon>
        </div>
      </template>
    </ProTableColumn>
    <ProTableColumn prop="manager.name" label="负责人" width="160">
      <template #default="{ row }">
        <div
          :class="[
            'group flex justify-between table-col-clickable',
            currentClickedRow?.id === row.id && !memberPickerPopoverDisappear ? 'bg-black/5' : ''
          ]"
          @click.stop="() => (currentClickedRow = row)"
          @mouseenter="
            ({ currentTarget }) => {
              memberPickerPopoverDisappear && (memberPickerPopoverVirtualRef = currentTarget)
              currentMemberPickerPopoverRef = currentTarget
            }
          "
        >
          <div class="flex items-center">
            <template v-if="row.manager">
              <el-avatar :size="24" :src="row.manager.avatar_str" />
              <span class="pl-1.5">{{ row.manager.name }}</span>
            </template>
          </div>
          <el-icon class="hidden group-hover:block" size="16">
            <User />
          </el-icon>
        </div>
      </template>
    </ProTableColumn>
    <ProTableColumn prop="level_status" label="优先级" width="140" sortable="custom">
      <template #default="{ row }">
        <div
          :class="[
            'group flex justify-between table-col-clickable',
            currentClickedRow?.id === row.id && !levelPopoverDisappear ? 'bg-black/5' : ''
          ]"
          @click.stop="() => (currentClickedRow = row)"
          @mouseenter="
            ({ currentTarget }) => {
              levelPopoverDisappear && (levelPopoverVirtualRef = currentTarget)
              currentLevelPopoverRef = currentTarget
            }
          "
        >
          <StatusButton v-if="row.level_status" :data="taskLevelMappings[row.level_status]" />
          <el-icon v-if="currentClickedRow?.id === row.id && !levelPopoverDisappear" size="16">
            <ArrowUp />
          </el-icon>
          <el-icon v-else class="hidden group-hover:block" size="16">
            <ArrowDown />
          </el-icon>
        </div>
      </template>
    </ProTableColumn>
    <ProTableColumn prop="end_time" label="截止日期" width="160" sortable="custom">
      <template #default="{ row }">
        <div
          :class="[
            'group flex justify-between table-col-clickable',
            currentClickedRow?.id === row.id && !endTimePopoverDisappear ? 'bg-black/5' : ''
          ]"
          @click.stop="() => (currentClickedRow = row)"
          @mouseenter="
            ({ currentTarget }) => {
              endTimePopoverDisappear && (endTimePopoverVirtualRef = currentTarget)
              currentEndTimePopoverRef = currentTarget
            }
          "
        >
          {{ row.end_time }}
        </div>
      </template>
    </ProTableColumn>
  </ProTable>
  <MemberPickerPopover
    :virtual-ref="memberPickerPopoverVirtualRef"
    virtual-triggering
    :model-value="currentClickedRow?.manager ? [currentClickedRow.manager] : []"
    @update:disappear="(v: boolean) => (memberPickerPopoverDisappear = v)"
    @update:model-value="handleMemberClick"
    @after-leave="() => (memberPickerPopoverVirtualRef = currentMemberPickerPopoverRef)"
  />
  <TaskStatusPopover
    :virtual-ref="statusPopoverVirtualRef"
    virtual-triggering
    :model-value="currentClickedRow?.current_status"
    @update:disappear="(v: boolean) => (statusPopoverDisappear = v)"
    @update:model-value="handleStatusClick"
    @after-leave="() => (statusPopoverVirtualRef = currentStatusPopoverRef)"
  />
  <TaskLevelPopover
    :virtual-ref="levelPopoverVirtualRef"
    virtual-triggering
    :model-value="currentClickedRow?.level_status"
    @update:disappear="(v: boolean) => (levelPopoverDisappear = v)"
    @update:model-value="handleLevelClick"
    @after-leave="() => (levelPopoverVirtualRef = currentLevelPopoverRef)"
  />
  <DatePickerPopover
    :virtual-ref="endTimePopoverVirtualRef"
    :model-value="currentClickedRow?.end_time"
    :disabled-date="
      (time: Date) => {
        return dayjs(time).isBefore(currentClickedRow?.start_time)
      }
    "
    @update:disappear="(v: boolean) => (endTimePopoverDisappear = v)"
    @update:model-value="handleEndTimeClick"
    @hide="() => (endTimePopoverVirtualRef = currentEndTimePopoverRef)"
  />
  <TaskDialog v-model:task-id="taskId" @update-data="updateCurrentClickedRow" />
  <AddTaskDialog v-model="addTaskDialogVisible" @submit-success="tableRef.paging()" />
</template>

<script setup lang="ts">
import { getTaskPaginationApi, TaskItem, updateTaskApi, batchDeleteTaskApi } from '@/api/task'
import ProTable from '@/components/ProTable/index.vue'
import { PaginationOptions } from '@/hooks/usePagination'
import { useUserStore } from '@/store/user'
import { Action, TabPaneName } from 'element-plus'
import { storeToRefs } from 'pinia'
import { taskStatusMappings, taskLevelMappings } from '@/utils/mappings'
import { MemberItem } from '@/api/member'
import { ArrowDown } from '@element-plus/icons-vue'
import type { Directive } from 'vue'
import dayjs from 'dayjs'

const addTaskDialogVisible = ref(false)
const currentClickedRow = ref<TaskItem>()
const taskId = ref<number>()

const handleRowClick = (row: TaskItem, column: any) => {
  if (column.type === 'selection') return
  currentClickedRow.value = row
  taskId.value = row.id
}

const selectionRows = ref<TaskItem[]>([])
const handleSelectionChange = (rows: TaskItem[]) => {
  selectionRows.value = rows
}

const handleBatchDel = () => {
  ElMessageBox.confirm(`确定要删除选中的${selectionRows.value.length}个任务吗？`, '批量删除任务', {
    type: 'error',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        await batchDeleteTaskApi(selectionRows.value.map(i => i.id))
        tableRef.value.paging()
      }
    }
  })
}

const handleSortChange = (...args: { order: 'descending' | 'ascending'; prop: string }[]) => {
  const params = {
    sort_type: args[0].order === 'ascending' ? 'asc' : 'desc',
    sort: args[0].prop
  }
  tableRef.value.paging(params)
}

const updateCurrentClickedRow = (data: Partial<TaskItem>) => {
  if (!currentClickedRow.value) {
    return
  }
  Object.assign(currentClickedRow.value, data)
}

// 标题相关
const handleClickEditTitle = (row: TaskItem) => {
  currentClickedRow.value = row
  editableTitleRow.value = { ...row }
}

const editableTitleRow = ref<Nullable<TaskItem>>(null)
const vFocus: Directive = {
  mounted: el => {
    el.focus()
  }
}

const handleChangeTitle = () => {
  const title = editableTitleRow.value?.task_name
  editableTitleRow.value = null
  if (!title) return

  const row = currentClickedRow.value
  if (row && title !== currentClickedRow.value?.task_name) {
    updateCurrentClickedRow({
      task_name: title
    })
    updateTaskApi({
      id: row.id,
      task_name: title
    })
  }
}

// 负责人弹窗相关
const memberPickerPopoverDisappear = ref(true)
const memberPickerPopoverVirtualRef = ref()
const currentMemberPickerPopoverRef = ref()

const handleMemberClick = (members: MemberItem[]) => {
  const row = currentClickedRow.value
  const member = members[0]
  if (row && row.manager?.id !== member.id) {
    updateCurrentClickedRow({
      manager: member,
      manager_id: member.id
    })
    updateTaskApi({
      id: row.id,
      manager_id: member.id
    })
  }
}

// 状态弹窗相关
const statusPopoverDisappear = ref(true)
const statusPopoverVirtualRef = ref()
const currentStatusPopoverRef = ref()

const handleStatusClick = (status: number) => {
  const row = currentClickedRow.value
  if (row && row.current_status !== status) {
    updateCurrentClickedRow({
      current_status: status
    })
    updateTaskApi({
      id: row.id,
      current_status: status
    })
  }
}

// 优先级弹窗相关
const levelPopoverDisappear = ref(true)
const levelPopoverVirtualRef = ref()
const currentLevelPopoverRef = ref()

const handleLevelClick = (level: number) => {
  const row = currentClickedRow.value
  if (row && row.level_status !== level) {
    updateCurrentClickedRow({
      level_status: level
    })
    updateTaskApi({
      id: row.id,
      level_status: level
    })
  }
}

// 截止日期相关
const endTimePopoverDisappear = ref(true)
const endTimePopoverVirtualRef = ref()
const currentEndTimePopoverRef = ref()

const handleEndTimeClick = (time: string) => {
  const row = currentClickedRow.value
  if (row && row.end_time !== time) {
    updateCurrentClickedRow({
      end_time: time
    })
    updateTaskApi({
      id: row.id,
      end_time: time
    })
  }
}

// 列表相关
type ActiveName = 'all' | 'resp' | 'join' | 'create'

const tableRef = ref()
const activeName = ref<ActiveName>('all')
const { currentProject, userInfo } = storeToRefs(useUserStore())

const requestParams = computed(() => {
  const params: Record<string, any> = {}

  switch (activeName.value) {
    case 'resp':
      params.manager_id = userInfo.value?.id
      break
    case 'join':
      params.manager_member_ids = userInfo.value?.id
      break
    case 'create':
      params.create_manager_id = userInfo.value?.id
      break
  }
  return params
})

const requestOptions: PaginationOptions = {
  manual: true,
  defaultParams: [
    {
      project_code: currentProject.value?.projectCode
    }
  ]
}

const run = () => {
  tableRef.value?.search(requestParams.value)
}

onMounted(() => {
  run()
})

const handleUpdateModelValue = (v: TabPaneName) => {
  activeName.value = v as ActiveName
  run()
}
</script>

<style lang="scss" scoped>
.title-input {
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.1);
}

:deep(.el-tabs__header.is-top) {
  margin-bottom: 0;
}
</style>
