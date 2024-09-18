<template>
  <el-dialog
    ref="dialogRef"
    :width="800"
    align-center
    class="project-dialog flex flex-col px-8! py-5!"
    :show-close="false"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <div>
          <span class="text-base font-bold">{{ isEdit ? '修改' : '新建' }}项目</span>
        </div>
        <div>
          <el-icon size="22" class="cursor-pointer text-black/50" @click="close"><Close /></el-icon>
        </div>
      </div>
    </template>
    <div v-loading="loading" class="h-full overflow-x-hidden pt-3">
      <el-form
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-position="top"
        size="large"
        :validate-on-rule-change="false"
        :show-message="false"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="formData.name" :clearable="true" />
        </el-form-item>
        <el-row :gutter="36">
          <el-col :span="12">
            <el-form-item prop="manager_id">
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
            <el-form-item prop="manager_member_ids">
              <MemberPickerPopover
                v-model="formData.manager_member_arr"
                placement="bottom-start"
                :single="false"
              >
                <div class="flex gap-x-1.5">
                  <div
                    v-for="item in formData.manager_member_arr"
                    :key="item.id"
                    class="group relative h-10 flex items-center"
                    @click.stop
                  >
                    <el-avatar :src="item.avatar_str" :size="36"></el-avatar>
                    <div
                      class="absolute right-0 top-0 hidden translate-x-1 cursor-pointer items-center justify-center rounded-full bg-[#cacaca] p-0.5 text-white group-hover:flex -translate-y-1 hover:bg-[var(--el-color-danger)]"
                      @click.stop="deleteManagerMember(item)"
                    >
                      <el-icon :size="12">
                        <CloseBold />
                      </el-icon>
                    </div>
                  </div>
                  <div class="group flex flex-1 cursor-pointer items-center">
                    <div
                      class="h-10 w-10 flex items-center justify-center border-1 border-black/25 rounded-full border-dashed group-hover:border-[var(--el-color-primary)]"
                    >
                      <el-icon
                        class="text-black/25 group-hover:text-[var(--el-color-primary)]"
                        :size="16"
                        ><User
                      /></el-icon>
                    </div>
                    <div class="ml-2 text-xs text-black/50">参与人</div>
                  </div>
                </div>
              </MemberPickerPopover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="start_time">
              <el-date-picker
                v-model="formData.start_time"
                type="date"
                class="w-full!"
                value-format="YYYY-MM-DD"
                :disabled-date="
                  (time: Date) => {
                    return !formData.end_time ? false : dayjs(time).isAfter(formData?.end_time)
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="end_time">
              <el-date-picker
                v-model="formData.end_time"
                type="date"
                class="w-full!"
                value-format="YYYY-MM-DD"
                :disabled-date="
                  (time: Date) => {
                    return !formData.start_time ? false : dayjs(time).isBefore(formData?.start_time)
                  }
                "
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="项目描述" prop="project_describe">
          <el-input
            v-model="formData.project_describe"
            :autosize="{ minRows: 4, maxRows: 4 }"
            type="textarea"
            placeholder="输入项目描述"
          />
        </el-form-item>
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
import { createProjectApi, getProjectDetailApi, ProjectItem, updateProjectApi } from '@/api/project'
import { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'
import { MemberItem } from '@/api/member'
import { isNumber, omit } from 'lodash'

interface Props {
  projectId?: number
}

const props = defineProps<Props>()

const isEdit = computed(() => !!props.projectId)

const emit = defineEmits(['submit-success', 'closed'])

const dialogRef = ref()

const formRef = ref<FormInstance>()

const formData = ref<Partial<ProjectItem>>({})

const rules: FormRules<ProjectItem> = {
  name: [{ required: true }]
}

const deleteManagerMember = (item: MemberItem) => {
  const v = formData.value
  if (v) {
    const index = v.manager_member_arr?.findIndex(m => m.id === item.id)

    if (isNumber(index) && index !== -1) {
      v.manager_member_arr!.splice(index, 1)
      const mIds = v.manager_member_arr!.map(m => m.id).join(',')
      v.manager_member_ids = mIds
    }
  }
}

const submiting = ref(false)
const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate(valid => {
    if (valid) {
      submiting.value = true
      const submitData = omit(formData.value, ['manager', 'manager_member_arr'])
      if (formData.value.manager) {
        submitData.manager_id = formData.value.manager.id
      } else {
        submitData.manager_id = 0
      }

      if (formData.value.manager_member_arr) {
        submitData.manager_member_ids = formData.value.manager_member_arr?.map(i => i.id).join(',')
      } else {
        submitData.manager_member_ids = ''
      }

      const fetchApi = isEdit.value ? updateProjectApi : createProjectApi
      fetchApi(submitData)
        .then(() => {
          emit('submit-success')
          dialogRef.value.visible = false
          ElNotification.success({
            title: `${isEdit.value ? '修改' : '新建'}项目成功`
          })
        })
        .finally(() => {
          submiting.value = false
        })
    }
  })
}

const loading = ref(false)
const handleOpen = () => {
  if (isEdit.value && props.projectId) {
    loading.value = true

    getProjectDetailApi(props.projectId)
      .then(({ id, name, start_time, end_time, project_describe, manager, manager_member_arr }) => {
        formData.value = {
          id,
          name,
          start_time,
          end_time,
          project_describe,
          manager,
          manager_member_arr
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const handleClosed = () => {
  formRef.value?.resetFields()
  formData.value = {}
  emit('closed')
}
</script>

<style lang="scss" scoped>
:global(.project-dialog > .el-dialog__header) {
  z-index: 9;
  background: white;
}

:global(.project-dialog > .el-dialog__body) {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
