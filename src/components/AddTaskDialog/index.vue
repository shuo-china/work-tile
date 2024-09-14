<template>
  <el-dialog
    ref="dialogRef"
    :width="800"
    align-center
    class="workload-dialog flex flex-col px-8! py-5!"
    :show-close="false"
    @closed="handleClosed"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <div>
          <span class="text-base font-bold">新建任务</span>
        </div>
        <div>
          <el-icon size="22" class="cursor-pointer text-black/50" @click="close"><Close /></el-icon>
        </div>
      </div>
    </template>
    <div class="h-full overflow-x-hidden pt-3">
      <el-form
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-position="top"
        size="large"
        :validate-on-rule-change="false"
        :show-message="false"
      >
        <el-form-item label="标题" prop="task_name">
          <el-input v-model="formData.task_name"></el-input>
        </el-form-item>
        <el-row :gutter="36">
          <el-col :span="12">
            <el-form-item label="类型" prop="task_type">
              <el-select v-model="formData.task_type" placeholder="请选择类型" :clearable="true">
                <template #label="{ value }">
                  <div class="flex items-center gap-x-2">
                    <div
                      class="h-2 w-2"
                      :style="{ background: taskTypeMappings[value].color }"
                    ></div>
                    {{ taskTypeMappings[value].text }}
                  </div>
                </template>
                <el-option
                  v-for="(item, k) in taskTypeMappings"
                  :key="k"
                  :value="k"
                  :label="item.text"
                >
                  <div class="flex items-center gap-x-2">
                    <el-icon>
                      <component :is="item.icon" :color="item.color"></component>
                    </el-icon>
                    {{ item.text }}
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="manager_id">
              <MemberPickerPopover
                :single="true"
                :model-value="formData.manager ? [formData.manager] : undefined"
                @update:model-value="
                  member => {
                    formData.manager = member[0]
                  }
                "
              >
                <div class="group flex flex-1 cursor-pointer items-center">
                  <template v-if="!formData.manager">
                    <div
                      class="h-10 w-10 flex items-center justify-center border-1 border-black/25 rounded-full border-dashed group-hover:border-[var(--el-color-primary)]"
                    >
                      <el-icon
                        class="text-black/25 group-hover:text-[var(--el-color-primary)]"
                        :size="16"
                        ><User
                      /></el-icon>
                    </div>
                    <div class="ml-2 text-xs text-black/50">负责人</div>
                  </template>
                  <template v-else>
                    <div class="h-10 flex items-center">
                      <el-avatar :src="formData.manager.avatar_str" :size="36"></el-avatar>
                      <div class="ml-2 text-xs">
                        <div>{{ formData.manager.name }}</div>
                      </div>
                      <div
                        class="hidden pl-5 text-black/20 group-hover:flex hover:text-[var(--el-color-danger)]"
                        @click.stop="formData.manager = undefined"
                      >
                        <el-icon><Close /></el-icon>
                      </div>
                    </div>
                  </template>
                </div>
              </MemberPickerPopover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止日期" prop="end_time">
              <el-date-picker
                v-model="formData.end_time"
                :clearable="false"
                type="date"
                class="w-full!"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="mt-3 flex justify-end">
          <el-button class="h-[36px] px-6" @click="dialogRef.visible = false">取消</el-button>
          <el-button class="h-[36px] px-6" type="primary" :loading="submiting" @click="handleSubmit"
            >确定</el-button
          >
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { taskTypeMappings } from '@/utils/mappings'

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'

import { createTaskApi, TaskItem } from '@/api/task'
import { omit } from 'lodash'

const emit = defineEmits(['submit-success', 'closed'])

const { currentProject } = storeToRefs(useUserStore())

const dialogRef = ref()

const formRef = ref<FormInstance>()

const rules: FormRules<TaskItem> = {
  task_name: [{ required: true }],
  task_type: [{ required: true }]
}

const formData = ref<Partial<TaskItem>>({})

const submiting = ref(false)
const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate(valid => {
    if (valid) {
      submiting.value = true

      const submitData = omit(formData.value, 'manager')
      if (formData.value.manager) {
        submitData.manager_id = formData.value.manager.id
      }

      createTaskApi({ ...submitData, project_code: currentProject.value?.projectCode })
        .then(() => {
          emit('submit-success')
          dialogRef.value.visible = false
          ElNotification.success({
            title: '任务创建成功'
          })
        })
        .finally(() => {
          submiting.value = false
        })
    }
  })
}

const handleClosed = () => {
  formRef.value?.resetFields()
  formData.value.manager = undefined
  emit('closed')
}
</script>

<style lang="scss" scoped>
:global(.workload-dialog > .el-dialog__header) {
  z-index: 9;
  background: white;
}

:global(.workload-dialog > .el-dialog__body) {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
