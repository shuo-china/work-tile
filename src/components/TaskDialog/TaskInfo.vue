<template>
  <div class="flex">
    <div class="flex-basis-1/2">
      <div class="mb-2.5">优先级：</div>
      <TaskLevelPopover
        :model-value="data?.level_status"
        @update:model-value="handleUpdateModelValue"
      >
        <el-tag
          class="w-[80px] cursor-pointer border-none!"
          size="large"
          effect="dark"
          :color="taskLevel?.color || 'rgba(0,0,0,0.05)'"
        >
          <span v-if="taskLevel">
            {{ taskLevel?.text }}
          </span>
          <span v-else class="text-black/50">无</span>
        </el-tag>
      </TaskLevelPopover>
    </div>
    <div class="flex-grow-1">
      <div class="mb-2.5">参与人：</div>
      <div class="flex gap-x-1.5">
        <div v-for="item in data?.manager_member_arr" :key="item.id" class="group relative text-0">
          <el-avatar :src="item.avatar_str" :size="32"></el-avatar>
          <div
            class="absolute right-0 top-0 hidden translate-x-1 cursor-pointer items-center justify-center rounded-full bg-[#cacaca] p-0.5 text-white group-hover:flex -translate-y-1 hover:bg-[var(--el-color-danger)]"
            @click="deleteManagerMember(item)"
          >
            <el-icon :size="12">
              <CloseBold />
            </el-icon>
          </div>
        </div>
        <MemberPickerPopover
          :single="false"
          :model-value="data?.manager_member_arr ? data.manager_member_arr : []"
          @update:model-value="handleUpdateManagerMember"
        >
          <div
            class="group h-8 w-8 flex cursor-pointer items-center justify-center border-1 border-black/25 rounded-full border-dashed hover:border-[var(--el-color-primary)]"
          >
            <el-icon class="text-black/25 group-hover:text-[var(--el-color-primary)]" :size="16"
              ><User
            /></el-icon>
          </div>
        </MemberPickerPopover>
      </div>
    </div>
  </div>
  <div class="mb-2.5 mt-6 h-[30px] flex items-center justify-between">
    <div>描述</div>
    <div>
      <el-tooltip content="编辑" placement="top" :enterable="false" :hide-after="0">
        <div
          v-show="!isEditDesc"
          class="flex cursor-pointer items-center justify-center rounded p-1.5 hover:bg-black/7 hover:text-[var(--el-color-primary)]"
          @click="
            () => {
              toggleIsEditDesc()
              editText = data?.task_describe || ''
            }
          "
        >
          <el-icon size="18">
            <Edit />
          </el-icon>
        </div>
      </el-tooltip>
    </div>
  </div>

  <div v-if="isEditDesc">
    <MdEditor v-model="editText" class="h-[220px]!" />
    <div class="mt-3 flex justify-end">
      <el-button @click="handleCancelDesc">取消</el-button>
      <el-button type="primary" @click="handleChangeDesc">保存</el-button>
    </div>
  </div>
  <MdPreview v-else :model-value="data?.task_describe || ''" />

  <div class="mt-4 flex items-center text-xs text-black/50">
    <el-avatar :src="data?.createManager.avatar_str" :size="22"></el-avatar>
    <div class="ml-2">
      {{ data?.createManager.name }}
      <span class="px-1">创建于</span>
      {{ data?.create_time }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { MemberItem } from '@/api/member'
import { TaskItem, updateTaskApi } from '@/api/task'
import { taskLevelMappings } from '@/utils/mappings'
import { useToggle } from '@vueuse/core'
import { isNumber } from 'lodash'
import { MdPreview } from 'md-editor-v3'

const emit = defineEmits(['update-data'])

const [isEditDesc, toggleIsEditDesc] = useToggle(false)

const data = defineModel<TaskItem>()

const editText = ref('')

const taskLevel = computed(() =>
  data.value?.level_status ? taskLevelMappings[data.value?.level_status] : null
)

const handleUpdateModelValue = (level: number) => {
  const v = data.value
  if (v) {
    v.level_status = level

    updateTaskApi({
      id: v.id,
      level_status: level
    })

    emit('update-data', {
      level_status: level
    })
  }
}

const handleUpdateManagerMember = (members: MemberItem[]) => {
  const v = data.value
  if (v) {
    const mIds = members.map(m => m.id).join(',')

    v.manager_member_arr = members
    v.manager_member_ids = mIds

    updateTaskApi({
      id: v.id,
      manager_member_ids: mIds
    })

    emit('update-data', {
      manager_member_arr: members,
      manager_member_ids: mIds
    })
  }
}

const deleteManagerMember = (item: MemberItem) => {
  const v = data.value
  if (v) {
    const index = v.manager_member_arr?.findIndex(m => m.id === item.id)

    if (isNumber(index) && index !== -1) {
      v.manager_member_arr!.splice(index, 1)
      const mIds = v.manager_member_arr!.map(m => m.id).join(',')
      v.manager_member_ids = mIds

      updateTaskApi({
        id: v.id,
        manager_member_ids: mIds
      })

      emit('update-data', {
        manager_member_arr: v.manager_member_arr,
        manager_member_ids: mIds
      })
    }
  }
}

const handleCancelDesc = () => {
  toggleIsEditDesc()
}

const handleChangeDesc = () => {
  const v = data.value
  if (v) {
    v.task_describe = editText.value

    updateTaskApi({
      id: v.id,
      task_describe: editText.value
    })

    toggleIsEditDesc()
  }
}
</script>

<style lang="scss" scoped>
:deep(.md-editor-preview-wrapper) {
  padding: 0 !important;
}
</style>
