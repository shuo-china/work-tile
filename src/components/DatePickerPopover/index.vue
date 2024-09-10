<template>
  <el-date-picker
    :visible="visible"
    placement="bottom"
    trigger="click"
    :width="430"
    :show-arrow="false"
    :hide-after="0"
    :virtual-triggering="true"
    :shortcuts="shortcuts"
    value-format="YYYY-MM-DD"
    popper-class="date-picker-popper"
    @update:visible="handleUpdateVisible"
    @update:model-value="handleUpdateModelValue"
  />
</template>

<script setup lang="ts">
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
import dayjs from 'dayjs'

const shortcuts = [
  {
    text: '今天',
    value: new Date()
  },
  {
    text: '明天',
    value: () => dayjs().add(1, 'day')
  },
  {
    text: '下周',
    value: () => dayjs().day(8)
  }
]

const emit = defineEmits([UPDATE_MODEL_EVENT, 'update:disappear'])

const visible = ref(false)

const handleUpdateModelValue = (v: string) => {
  visible.value = false
  emit(UPDATE_MODEL_EVENT, v)
}

const handleUpdateVisible = (v: boolean) => {
  visible.value = v
  emit('update:disappear', !v)
}
</script>

<style lang="scss" scoped>
:global(.el-picker-panel__sidebar) {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:global(.el-picker-panel__shortcut) {
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 12px;
  display: flex;
  border-radius: 4px;
  justify-content: center;
}

:global(.el-picker-panel__shortcut:hover) {
  border-color: var(--el-datepicker-hover-text-color);
}
</style>
