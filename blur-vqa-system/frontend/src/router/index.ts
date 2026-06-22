import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '@/stores/session';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: '登录',
        appSection: 'public'
      }
    },
    {
      path: '/user/workbench',
      name: 'user-workbench',
      component: () => import('@/views/WorkbenchView.vue'),
      meta: {
        title: '用户端 - 智能问答',
        appSection: 'user',
        requiresAuth: true,
        allowedRoles: ['user', 'admin']
      }
    },
    {
      path: '/user/history',
      name: 'user-history',
      component: () => import('@/views/HistoryView.vue'),
      meta: {
        title: '用户端 - 历史记录',
        appSection: 'user',
        requiresAuth: true,
        allowedRoles: ['user', 'admin']
      }
    },
    {
      path: '/admin/overview',
      name: 'admin-overview',
      component: () => import('@/views/AdminOverviewView.vue'),
      meta: {
        title: '管理端 - 首页概览',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('@/views/AdminUsersView.vue'),
      meta: {
        title: '管理端 - 用户管理',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/records',
      name: 'admin-records',
      component: () => import('@/views/AdminRecordsView.vue'),
      meta: {
        title: '管理端 - 问答记录',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/analytics',
      name: 'admin-analytics',
      component: () => import('@/views/AdminAnalyticsView.vue'),
      meta: {
        title: '管理端 - 数据统计',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/models',
      name: 'admin-models',
      component: () => import('@/views/AdminModelsView.vue'),
      meta: {
        title: '管理端 - 模型管理',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/safety',
      name: 'admin-safety',
      component: () => import('@/views/AdminSafetyView.vue'),
      meta: {
        title: '管理端 - 风险与安全',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('@/views/AdminSettingsView.vue'),
      meta: {
        title: '管理端 - 系统设置',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/logs',
      name: 'admin-logs',
      component: () => import('@/views/AdminLogsView.vue'),
      meta: {
        title: '管理端 - 日志管理',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    },
    {
      path: '/admin/profile',
      name: 'admin-profile',
      component: () => import('@/views/AdminProfileView.vue'),
      meta: {
        title: '管理端 - 个人中心',
        appSection: 'admin',
        requiresAuth: true,
        allowedRoles: ['admin']
      }
    }
  ]
});

router.beforeEach((to) => {
  const session = useSessionStore();
  const requiresAuth = Boolean(to.meta.requiresAuth);
  const allowedRoles = (to.meta.allowedRoles as Array<'user' | 'admin'> | undefined) ?? [];

  if (!requiresAuth) {
    return true;
  }

  if (!session.isAuthenticated.value) {
    return '/login';
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.currentRole.value as 'user' | 'admin')) {
    return session.currentRole.value === 'admin' ? '/admin/overview' : '/user/workbench';
  }

  return true;
});

router.afterEach((to) => {
  document.title = `${to.meta.title ?? '系统'} | 模糊视觉辅助问答系统`;
});

export default router;
