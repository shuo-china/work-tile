<template>
  <el-dialog
    width="90%"
    :model-value="visible"
    :show-close="false"
    @update:model-value="handleUpdateModelValue"
    @click.stop.prevent
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <div class="flex items-center">
          <div class="flex items-center rounded bg-black/5 px-3 py-1 text-xs">
            <el-icon
              :size="14"
              :style="{
                color: taskType?.color || ''
              }"
            >
              <component :is="taskType?.icon" />
            </el-icon>
            <span class="pl-1">
              {{ taskType?.text }}
            </span>
            <span class="pl-2">
              {{ data?.id }}
            </span>
          </div>
          <el-divider direction="vertical" class="mx-4!" />
          <span class="text-sm text-black/50">{{ data?.project.name }}</span>
        </div>
        <div class="flex items-center">
          <el-icon size="22" class="cursor-pointer text-black/50" @click="close"><Close /></el-icon>
        </div>
      </div>
    </template>

    <div v-if="data" class="flex flex-col">
      <!-- 标题 -->
      <el-input
        v-model="data.task_name"
        placeholder="输入标题"
        :class="['title-input', data.task_name === '' ? 'is-empty' : '']"
        @blur="handleChangeTitle"
        @keyup.enter="handleTitleInputEnter"
      />
      <!-- 任务状态 -->
      <div class="my-6 flex">
        <TaskStatusPopover
          :model-value="data.current_status"
          placement="bottom-start"
          @update:model-value="handleUpdateStatus"
        >
          <div class="flex flex-1 cursor-pointer items-center">
            <el-icon :color="taskStatus?.color" :size="40">
              <component :is="taskStatus?.icon" />
            </el-icon>
            <div class="ml-2">
              <div>{{ taskStatus?.text }}</div>
              <div class="mt-1 text-xs text-black/50">当前状态</div>
            </div>
          </div>
        </TaskStatusPopover>
        <!-- 负责人 -->
        <MemberPickerPopover
          :model-value="[data.manager]"
          @update:model-value="handleUpdateManager"
        >
          <div class="group flex flex-1 cursor-pointer items-center">
            <template v-if="!data.manager">
              <div
                class="h-9 w-9 flex items-center justify-center border-1 border-black/25 rounded-full border-dashed group-hover:border-[var(--el-color-primary)]"
              >
                <el-icon class="text-black/25 group-hover:text-[var(--el-color-primary)]" :size="16"
                  ><User
                /></el-icon>
              </div>
              <div class="ml-2 text-xs text-black/50">负责人</div>
            </template>
            <template v-else>
              <el-avatar :src="data.manager.avatar_str" :size="36"></el-avatar>
              <div class="ml-2">
                <div>{{ data.manager.name }}</div>
                <div class="mt-1 text-xs text-black/50">负责人</div>
              </div>
            </template>
          </div>
        </MemberPickerPopover>
        <!-- 开始时间 -->
        <div ref="startTimeRef" class="flex-1">
          <div class="group flex flex-1 cursor-pointer items-center">
            <template v-if="!data.start_time">
              <div
                class="h-9 w-9 flex items-center justify-center border-1 border-black/25 rounded-full border-dashed group-hover:border-[var(--el-color-primary)]"
              >
                <el-icon class="text-black/25 group-hover:text-[var(--el-color-primary)]" :size="16"
                  ><Calendar
                /></el-icon>
              </div>
              <div class="ml-2 text-xs text-black/50">开始时间</div>
            </template>
            <template v-else>
              <div
                class="h-9 w-9 flex items-center justify-center border-1 border-black/25 rounded-full border-dashed group-hover:border-[var(--el-color-primary)]"
              >
                <el-icon class="text-black/25 group-hover:text-[var(--el-color-primary)]" :size="16"
                  ><Calendar
                /></el-icon>
              </div>
              <div class="ml-2">
                <div>{{ data.start_time }}</div>
                <div class="mt-1 text-xs text-black/50">开始时间</div>
              </div>
            </template>
          </div>
        </div>
        <!-- 截止时间 -->
        <div ref="endTimeRef" class="flex-1">
          <div class="group flex flex-1 cursor-pointer items-center">
            <template v-if="!data.end_time">
              <div
                class="h-9 w-9 flex items-center justify-center border-1 border-black/25 rounded-full border-dashed group-hover:border-[var(--el-color-primary)]"
              >
                <el-icon class="text-black/25 group-hover:text-[var(--el-color-primary)]" :size="16"
                  ><Calendar
                /></el-icon>
              </div>
              <div class="ml-2 text-xs text-black/50">截止时间</div>
            </template>
            <template v-else>
              <div
                class="h-9 w-9 flex items-center justify-center border-1 border-black/25 rounded-full border-dashed group-hover:border-[var(--el-color-primary)]"
              >
                <el-icon class="text-black/25 group-hover:text-[var(--el-color-primary)]" :size="16"
                  ><Calendar
                /></el-icon>
              </div>
              <div class="ml-2">
                <div>{{ data.end_time }}</div>
                <div class="mt-1 text-xs text-black/50">截止时间</div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- tabs -->
      <el-tabs v-model="tabName" class="demo-tabs">
        <template #addIcon>123</template>
        <el-tab-pane name="task_info">
          <template #label>
            <el-icon :size="16"><Operation /> </el-icon>
            <span class="pl-1">任务信息</span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="workload">
          <template #label>
            <el-icon :size="16"><Timer /></el-icon>
            <span class="pl-1">工时</span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="附件" name="files">
          <template #label>
            <el-icon :size="16"><Link /></el-icon>
            <span class="pl-1">附件</span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <TaskInfo v-if="tabName === 'task_info'" />
      <Workload v-if="tabName === 'workload'" />
      <Files v-if="tabName === 'files'" />

      <DatePickerPopover
        :model-value="data.start_time"
        :virtual-ref="startTimeRef"
        :disabled-date="
          (time: Date) => {
            return dayjs(time).isAfter(data?.end_time)
          }
        "
        @update:model-value="handleUpdateStartTime"
      />
      <DatePickerPopover
        :model-value="data.end_time"
        :virtual-ref="endTimeRef"
        @update:model-value="handleUpdateEndTime"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import useRequest from '@/hooks/useRequest'
import { taskStatusMappings, taskTypeMappings } from '@/utils/mappings'
import { getTaskDetailApi, TaskItem, updateTaskApi } from '@/api/task'
import { MemberItem } from '@/api/member'
import TaskInfo from './TaskInfo.vue'
import Workload from './Workload.vue'
import Files from './Files.vue'
import dayjs from 'dayjs'

type TabName = 'task_info' | 'workload' | 'files'
const tabName = ref<TabName>('task_info')

const startTimeRef = ref()
const endTimeRef = ref()

const taskIdModel = defineModel<number>('taskId')

const emit = defineEmits(['update-data'])

const visible = ref(!!taskIdModel.value)

const handleUpdateModelValue = (val: boolean) => {
  visible.value = val
  if (!val) {
    taskIdModel.value = undefined
  }
}

const handleTitleInputEnter = (e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement
  if (!target.value) {
    return
  }
  target.blur()
}

const handleChangeTitle = () => {
  const v = data.value
  if (v?.task_name === '' || !v?.id) {
    return
  }

  updateTaskApi({
    id: v.id,
    task_name: v.task_name
  })

  emit('update-data', {
    task_name: v.task_name
  })
}

const handleUpdateStatus = (status: number) => {
  const v = data.value
  if (v) {
    v.current_status = status

    updateTaskApi({
      id: v.id,
      current_status: status
    })

    emit('update-data', {
      current_status: status
    })
  }
}

const handleUpdateManager = (managers: MemberItem[]) => {
  const v = data.value
  const manager = managers[0]

  if (v) {
    v.manager_id = manager.id
    v.manager = manager

    updateTaskApi({
      id: v.id,
      manager_id: manager.id
    })

    emit('update-data', {
      manager: manager,
      manager_id: manager.id
    })
  }
}

const handleUpdateStartTime = (startTime: string) => {
  const v = data.value

  if (v) {
    v.start_time = startTime

    updateTaskApi({
      id: v.id,
      start_time: startTime
    })

    emit('update-data', {
      start_time: startTime
    })
  }
}

const handleUpdateEndTime = (endTime: string) => {
  const v = data.value

  if (v) {
    v.end_time = endTime

    updateTaskApi({
      id: v.id,
      end_time: endTime
    })

    emit('update-data', {
      end_time: endTime
    })
  }
}

const data = ref<Nullable<TaskItem>>(null)
const { runAsync } = useRequest(getTaskDetailApi, {
  manual: true
})

const taskType = computed(() =>
  data.value?.task_type ? taskTypeMappings[data.value.task_type] : null
)

const taskStatus = computed(() =>
  data.value?.current_status ? taskStatusMappings[data.value.current_status] : null
)

watch(taskIdModel, newVal => {
  visible.value = !!newVal
  if (newVal) {
    runAsync(newVal).then(res => (data.value = res))
    console.log('请求数据')
  } else {
    console.log('clear')
  }
})
</script>

<style lang="scss" scoped>
.title-input {
  :deep(.el-input__wrapper) {
    --el-input-height: 46px;
    padding: 0 12px;
    font-size: 24px;
    box-shadow: none;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    &.is-focus {
      border: 1px solid var(--el-input-focus-border-color);
    }
  }

  &.is-empty {
    :deep(.el-input__wrapper) {
      border: 1px solid var(--el-color-danger);
    }
  }
}

:deep(.el-tabs__item.is-top) {
  width: 100px !important;
}
</style>
