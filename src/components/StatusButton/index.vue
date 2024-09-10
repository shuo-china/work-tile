<template>
  <el-button
    :icon="data.icon"
    :color="data.color"
    size="small"
    round
    class="pointer-events-none text-white"
  >
    {{ data.text }}
  </el-button>
</template>

<script setup lang="ts">
interface Props {
  data: {
    text: string
    color?: string
    icon?: string
  }
}

defineProps<Props>()
</script>

<style lang="scss" scoped></style>
