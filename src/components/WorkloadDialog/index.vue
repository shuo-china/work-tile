<template>
  <el-dialog
    ref="dialogRef"
    :width="800"
    align-center
    class="workload-dialog flex flex-col px-8! py-5!"
    :show-close="false"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <div>
          <span class="text-base font-bold">工时登记</span>
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
        <el-form-item label="选择登记任务" prop="task_code">
          <el-select
            v-model="formData.task_code"
            v-loading="loadingTaskOptions"
            class="w-full!"
            :disabled="!!taskCode"
          >
            <template #label="{ label }">
              <div v-if="selectedTaskType" class="flex items-center gap-x-2">
                <el-icon>
                  <component
                    :is="taskTypeMappings[selectedTaskType].icon"
                    :color="taskTypeMappings[selectedTaskType].color"
                  ></component>
                </el-icon>
                {{ label }}
              </div>
            </template>
            <el-option
              v-for="item in taskOptions"
              :key="item.id"
              :label="item.task_name"
              :value="item.task_code"
            >
              <div class="flex items-center gap-x-2">
                <el-icon>
                  <component
                    :is="taskTypeMappings[item.task_type].icon"
                    :color="taskTypeMappings[item.task_type].color"
                  ></component>
                </el-icon>
                {{ item.task_name }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="36">
          <el-col v-if="!workloadId" :span="12">
            <el-form-item label="开始日期" prop="start_time">
              <el-date-picker
                v-model="formData.start_time"
                :clearable="false"
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
          <el-col v-if="!workloadId" :span="12">
            <el-form-item label="结束日期" prop="end_time">
              <el-date-picker
                v-model="formData.end_time"
                :clearable="false"
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
          <el-col :span="12">
            <el-form-item label="工作时长" prop="duration">
              <el-input
                v-model="formData.duration"
                placeholder="添加工时"
                min="1"
                type="number"
                controls-position="right"
                class="w-full!"
              >
                <template #append>小时</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工时类别" prop="working_hours_type">
              <el-select
                v-model="formData.working_hours_type"
                placeholder="请选择工时类别"
                :clearable="true"
              >
                <template #label="{ value }">
                  <div class="flex items-center gap-x-2">
                    <div
                      class="h-2 w-2"
                      :style="{ background: workloadTypeMappings[value].color }"
                    ></div>
                    {{ workloadTypeMappings[value].text }}
                  </div>
                </template>
                <el-option
                  v-for="(item, k) in workloadTypeMappings"
                  :key="k"
                  :value="k"
                  :label="item.text"
                >
                  <div class="flex items-center gap-x-2">
                    <div class="h-2 w-2" :style="{ background: item.color }"></div>
                    {{ item.text }}
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="工时描述" prop="describe">
          <el-input
            v-model="formData.describe"
            :autosize="{ minRows: 4, maxRows: 4 }"
            type="textarea"
            placeholder="输入工时描述"
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
import { dayjs, FormInstance, FormRules } from 'element-plus'
import { workloadTypeMappings, taskTypeMappings } from '@/utils/mappings'
import {
  createWorkloadApi,
  getWorkloadDetailApi,
  updateWorkloadApi,
  type WorkloadItem
} from '@/api/workload'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'
import useRequest from '@/hooks/useRequest'
import { getTaskOptionsApi } from '@/api/task'

interface Props {
  taskCode?: string
  workloadId?: number
}

const props = defineProps<Props>()

const isEdit = computed(() => !!props.workloadId)

const emit = defineEmits(['submit-success', 'closed'])

const { currentProject } = storeToRefs(useUserStore())

const dialogRef = ref()

const formRef = ref<FormInstance>()

const { data: taskOptions, loading: loadingTaskOptions } = useRequest(getTaskOptionsApi, {
  defaultParams: [currentProject.value!.projectCode]
})

const rules = computed(() => {
  const rs: FormRules<WorkloadItem> = {
    task_code: [{ required: true }],
    start_time: [{ required: true }]
  }

  if (!isEdit.value) {
    rs.end_time = [{ required: true }]
    rs.duration = [{ required: true }]
  }

  return rs
})

const getInitialValues = () => {
  const currentDate = dayjs().format('YYYY-MM-DD')

  return {
    start_time: currentDate,
    end_time: currentDate,
    task_code: props.taskCode
  }
}

const formData = ref<Partial<WorkloadItem>>({})

const selectedTaskType = computed(() => {
  const taskCode = formData.value.task_code
  return taskOptions.value?.find(o => o.task_code === taskCode)?.task_type
})

const submiting = ref(false)
const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate(valid => {
    if (valid) {
      submiting.value = true
      const fetchApi = isEdit.value ? updateWorkloadApi : createWorkloadApi
      fetchApi({ ...formData.value, project_code: currentProject.value?.projectCode })
        .then(() => {
          emit('submit-success')
          dialogRef.value.visible = false
          ElNotification.success({
            title: `${isEdit.value ? '修改' : '登记'}工时成功`
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
  if (isEdit.value && props.workloadId) {
    loading.value = true

    getWorkloadDetailApi(props.workloadId)
      .then(({ id, duration, working_hours_type, describe, task_code }) => {
        formData.value = {
          id,
          task_code,
          duration,
          working_hours_type,
          describe
        }
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    formData.value = getInitialValues()
  }
}

const handleClosed = () => {
  formRef.value?.resetFields()
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
