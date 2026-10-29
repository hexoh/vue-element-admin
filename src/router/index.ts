import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { Layout /*,  getParentLayout */ } from './generate'
import { useI18n } from '@/hooks/web/useI18n'
import { NO_RESET_WHITE_LIST } from '@/constants'

const { t } = useI18n()

// 常量路由
export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home/index',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'RedirectWrap',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Index.vue'),
    meta: {
      title: t('router.login'),
      hidden: true,
      noTagsView: true,
      noCache: true
    }
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/analysis',
    component: Layout,
    meta: {
      title: t('router.dashboard'),
      icon: 'vi-ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/home/HomeView.vue'),
        name: 'Analysis',
        meta: {
          title: t('router.analysis'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'index',
        component: () => import('@/views/home/HomeView.vue'),
        name: 'HomeIndex',
        meta: {
          title: t('router.workplace'),
          affix: true
        }
      }
    ]
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/center',
    name: 'Personal',
    meta: {
      title: t('router.personal'),
      hidden: true,
      canTo: true
    },
    children: [
      {
        path: 'center',
        component: () => import('@/views/personal/Center.vue'),
        name: 'PersonalCenter',
        meta: {
          title: t('router.personalCenter'),
          hidden: true,
          canTo: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

// 动态路由
export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/home/AboutView.vue'),
    meta: {
      title: t('router.about'),
      icon: 'info-filled',
      affix: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string) && router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
