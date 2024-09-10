<template>
  <ProPopover
    ref="popoverRef"
    popper-class="px-0!"
    :width="250"
    placement="bottom"
    trigger="click"
    :show-arrow="false"
    :hide-after="0"
    @show="handleShow"
    @after-leave="handleAfterLeave"
  >
    <template #reference>
      <slot></slot>
    </template>
    <div v-loading="loading">
      <div
        v-for="item in data"
        :key="item.id"
        class="h-10 flex cursor-pointer items-center px-3 hover:bg-black/5"
        @click="handleClickMemeber(item)"
      >
        <div class="flex-shrink-0 text-0">
          <el-avatar :size="20" :src="item.avatar_str"></el-avatar>
        </div>
        <div class="flex-grow-1 p-2">{{ item.name }}</div>
        <div v-if="userStore.userInfo?.id === item.id" class="w-15 flex-shrink-0">
          <el-tag type="info" size="small">我自己</el-tag>
        </div>
        <div class="w-4 flex flex-shrink-0 items-center text-[var(--el-color-primary)]">
          <el-icon v-if="ids.includes(item.id)" size="18">
            <Check />
          </el-icon>
        </div>
      </div>
    </div>
  </ProPopover>
</template>

<script setup lang="ts">
import { getMemberListApi, MemberItem } from '@/api/member'
import useRequest from '@/hooks/useRequest'
import { useUserStore } from '@/store/user'

const props = withDefaults(
  defineProps<{
    single?: boolean
  }>(),
  {
    single: true
  }
)

export interface ModelValueItem {
  id: number
  avatar_str: string
  name: string
}

const modelValue = defineModel<ModelValueItem[]>()

const ids = computed(() => (modelValue.value ? modelValue.value.map(i => i.id) : []))

const emit = defineEmits(['after-leave'])

const userStore = useUserStore()

const popoverRef = ref()

const { run, data, loading } = useRequest(getMemberListApi, { manual: true })

const handleShow = () => {
  run()
}

const handleAfterLeave = () => {
  data.value = []
  emit('after-leave')
}

const handleClickMemeber = (member: MemberItem) => {
  popoverRef.value?.getInstance()?.hide()

  if (!modelValue.value || props.single) {
    modelValue.value = [member]
  } else {
    const v = { ...modelValue.value }
    const index = v.findIndex(i => i.id === member.id)

    if (index !== -1) {
      v.splice(index, 1)
      modelValue.value = v
    } else {
      v.push(member)
      modelValue.value = v
    }
  }
}
</script>
