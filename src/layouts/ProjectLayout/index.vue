<template>
  <el-container class="h-full">
    <el-header class="h-auto px-0">
      <NavigationBar />
    </el-header>
    <el-container>
      <el-aside class="w-auto overflow-visible">
        <Sidebar />
      </el-aside>
      <el-main class="p-0">
        <AppMain />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import AppMain from '@/layouts/components/AppMain.vue'
import Sidebar from './Sidebar.vue'
import NavigationBar from './NavigationBar.vue'
</script>

<style lang="scss" scoped></style>
