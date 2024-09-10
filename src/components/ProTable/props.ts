import { PaginationOptions } from '@/hooks/usePagination'
import { Service } from '@/hooks/useRequest/type'
import { definePropType } from '@/utils/prop'
import { PaginationProps } from 'element-plus'
import tableProps from 'element-plus/es/components/table/src/table/defaults.mjs'

export const proTableProps = {
  request: {
    type: definePropType<Service<any, any>>(Function),
    required: true
  },
  tableCardBorder: {
    type: Boolean,
    default: true
  },
  searchCardBorder: {
    type: Boolean,
    default: true
  },
  requestOptions: {
    type: definePropType<PaginationOptions>(Object)
  },
  paginationProps: {
    type: definePropType<Partial<PaginationProps>>(Object)
  }
} as const

export type ProTableProps = typeof proTableProps & typeof tableProps
