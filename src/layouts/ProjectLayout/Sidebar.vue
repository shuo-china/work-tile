<template>
  <div
    class="w-project-sidebar h-full flex flex-col justify-between border-r border-r-black/7 border-r-style-solid"
  >
    <div class="relative flex-grow">
      <Menu :menus="menus" :active-menu="activeMenu" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Menu from './Menu.vue'
import { useProjectMenuStore } from '@/store/project-menu'

const { menus, activeMenu } = storeToRefs(useProjectMenuStore())
</script>
