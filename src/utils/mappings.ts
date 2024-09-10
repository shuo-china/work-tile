enum Color {
  INFO = '#909399',
  SUCCESS = '#67c23a',
  WARNING = '#e6a23c',
  PRIMARY = '#409eff',
  DANGER = '#f56c6c',
  EMERGENCY = '#c45656'
}

type Mappings<T = any> = {
  [k: string | number]: T
}

export type TaskStatusMappingValue = {
  text: string
  color: Color
  icon: string
}

export const taskStatusMappings: Mappings<TaskStatusMappingValue> = {
  1: {
    text: '未开始',
    color: Color.INFO,
    icon: 'remove-filled'
  },
  2: {
    text: '进行中',
    color: Color.PRIMARY,
    icon: 'info-filled'
  },
  3: {
    text: '已完成',
    color: Color.SUCCESS,
    icon: 'success-filled'
  }
}

export type TaskLevelMappingValue = {
  text: string
  color: Color
}

export const taskLevelMappings: Mappings<TaskLevelMappingValue> = {
  1: {
    text: '立即处理',
    color: Color.EMERGENCY
  },
  2: {
    text: '优先处理',
    color: Color.DANGER
  },
  3: {
    text: '高度重视',
    color: Color.WARNING
  },
  4: {
    text: '正常',
    color: Color.PRIMARY
  },
  5: {
    text: '较低',
    color: Color.SUCCESS
  }
}

export type TaskTypeMappingValue = {
  text: string
  color: Color
  icon: string
}

export const taskTypeMappings: Mappings<TaskTypeMappingValue> = {
  1: {
    text: '任务',
    color: Color.SUCCESS,
    icon: 'success-filled'
  },
  2: {
    text: '事务',
    color: Color.PRIMARY,
    icon: 'list'
  },
  3: {
    text: '缺陷',
    color: Color.DANGER,
    icon: 'warning-filled'
  },
  4: {
    text: '活动',
    color: Color.WARNING,
    icon: 'trend-charts'
  },
  5: {
    text: '其它',
    color: Color.INFO,
    icon: 'more-filled'
  }
}
