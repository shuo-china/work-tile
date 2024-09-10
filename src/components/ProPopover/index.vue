<template>
  <el-popover
    ref="_ref"
    v-bind="$attrs"
    @update:visible="handleUpdateVisible"
    @after-leave="handleAfterLeave"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}"></slot>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { PopoverInstance, popoverProps } from 'element-plus/es/components/popover/src/popover.mjs'

defineProps({} as typeof popoverProps)

const emit = defineEmits(['update:visible', 'after-leave', 'update:disappear'])

const handleAfterLeave = () => {
  emit('after-leave')
  emit('update:disappear', true)
}

const handleUpdateVisible = (visible: boolean) => {
  emit('update:visible', visible)
  if (visible) {
    emit('update:disappear', false)
  }
}

const _ref = ref()

const _expose = {
  getInstance: () => _ref.value as PopoverInstance
}

defineExpose(_expose)
</script>

<style lang="scss" scoped></style>
