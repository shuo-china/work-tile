import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layouts/index.vue'
import ProjectLayout from '@/layouts/ProjectLayout/index.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/login-callback',
    component: () => import('@/pages/login/Callback.vue'),
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/403',
    component: Layout,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '',
        component: () => import('@/pages/exception/403.vue')
      }
    ]
  },
  {
    path: '/404',
    component: Layout,
    alias: '/:pathMatch(.*)*',
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '',
        component: () => import('@/pages/exception/404.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/pages/home/index.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/project/all',
    component: Layout,
    children: [
      {
        path: '',
        name: 'ProjectAll',
        component: () => import('@/pages/project/all/index.vue'),
        meta: {
          title: '全部项目'
        }
      }
    ]
  }
]

export const projectRoutes = [
  {
    path: '/project',
    component: ProjectLayout,
    redirect: '/project/task',
    children: [
      {
        path: 'task',
        name: 'projectTask',
        component: () => import('@/pages/project/task/index.vue'),
        meta: {
          title: '任务',
          icon: 'document'
        }
      }
    ]
  },
  {
    path: '/project',
    component: ProjectLayout,
    redirect: '/project/workload',
    children: [
      {
        path: 'workload',
        name: 'projectWorkload',
        component: () => import('@/pages/project/workload/index.vue'),
        meta: {
          title: '工时',
          icon: 'document'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes, ...projectRoutes]
})

export default router
