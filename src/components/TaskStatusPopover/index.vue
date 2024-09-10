<template>
  <ProPopover
    ref="popoverRef"
    popper-class="min-w-0! w-auto! px-0!"
    placement="bottom"
    trigger="click"
    :show-arrow="false"
    :hide-after="0"
  >
    <template #reference>
      <slot></slot>
    </template>

    <div
      v-for="(item, k) in taskStatusMappings"
      :key="k"
      :class="[
        'h-12 w-full flex cursor-pointer items-center justify-center px-4 hover:bg-black/5',
        model === +k ? 'bg-black/5' : ''
      ]"
      @click="handleClick(+k)"
    >
      <StatusButton :data="item" />
    </div>
  </ProPopover>
</template>

<script setup lang="ts">
import { taskStatusMappings } from '@/utils/mappings'

const model = defineModel<number>()

const popoverRef = ref()

const handleClick = (status: number) => {
  popoverRef.value?.getInstance()?.hide()
  model.value = status
}
</script>

<style lang="scss" scoped></style>
