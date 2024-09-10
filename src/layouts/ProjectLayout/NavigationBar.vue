<template>
  <div class="h-navigationbar flex items-center border-b border-b-black/7 border-b-style-solid">
    <div class="flex flex-shrink-0 items-center px-5">
      <Logo :show-title="false" />
      <div class="ml-4">
        <Breadcrumb />
      </div>
    </div>
    <div class="flex-grow"></div>
    <div class="flex flex-shrink-0 items-center px-5">
      <AvatarDropdown />
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/layouts/components/Logo/index.vue'
import Breadcrumb from './Breadcrumb.vue'
import AvatarDropdown from '@/layouts/components/AvatarDropdown/index.vue'
</script>

<style lang="scss" scoped></style>
