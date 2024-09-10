<template>
  <el-menu
    class="h-full border-none!"
    :default-active="activeMenu?.path"
    :unique-opened="true"
    :collapse-transition="false"
    :collapse="appStore.sidebarCollapsed"
    mode="vertical"
    v-bind="$attrs"
  >
    <MenuItemLink v-for="menu in menus" :key="menu.path" :to="menu.path">
      <el-menu-item :index="menu.path">
        <template #title
          ><span class="mt-1.5 text-xs">{{ menu.title }}</span></template
        >
        <el-icon><component :is="menu.icon" v-if="menu.icon" /></el-icon>
      </el-menu-item>
    </MenuItemLink>
  </el-menu>
</template>

<script setup lang="ts">
import { Menu } from '@/store/menu'
import MenuItemLink from '@/layouts/components/Menu/MenuItemLink.vue'
import { useAppStore } from '@/store/app'

defineOptions({
  inheritAttrs: false
})

interface Props {
  menus: Menu[]
  activeMenu: Nullable<Menu>
}

defineProps<Props>()

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';

.el-menu {
  --el-menu-bg-color: rgb(242, 245, 247);
  @include clearfix;

  .el-menu-item {
    flex-direction: column;
    justify-content: center;
    height: 55px;
    margin: 20px 0;

    & > .el-icon {
      margin: 0;
    }
  }
}
</style>
