import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/views/Layout.vue';
import { setupRouterGuards } from './guards';

// 主布局路由
const mainRoutes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  redirect: '/private',
  children: [
    {
      path: 'private',
      name: 'private',
      component: () => import('@/views/private/index.vue'),
      meta: { title: '个人知识库', keepAlive: true },
    },
    {
      path: 'create',
      name: 'create',
      component: () => import('@/views/private/create/index.vue'),
      meta: { title: '创建知识库' },
    },
    {
      path: 'details',
      name: 'details',
      component: () => import('@/views/private/details.vue'),
      meta: { title: '知识库详情' },
    },
    {
      path: 'public',
      name: 'public',
      component: () => import('@/views/public/index.vue'),
      meta: { title: '公开知识库', keepAlive: true },
    },
    {
      path: 'team',
      name: 'team',
      component: () => import('@/views/team/blank.vue'),
      meta: { title: '团队知识库' },
    },
    {
      path: 'team/:teamId/datasets',
      component: () => import('@/views/team/index.vue'),
      meta: { title: '团队数据集', requiresSwitch: true },
    },
    {
      path: 'team/:teamId/create',
      component: () => import('@/views/private/create/index.vue'),
      meta: { title: '创建团队知识库', requiresSwitch: true },
    },
    {
      path: 'team/:teamId/dataset/:datasetId',
      component: () => import('@/views/team/index.vue'),
      meta: { title: '团队知识库详情', requiresSwitch: true },
    },
    {
      path: 'team/:teamId/member',
      component: () => import('@/views/team/member.vue'),
      meta: { title: '团队成员', requiresSwitch: true },
    },
    {
      path: 'team/:teamId/setting',
      component: () => import('@/views/team/setting.vue'),
      meta: { title: '团队设置', requiresSwitch: true },
    },
    {
      path: 'team/:teamId/details',
      component: () => import('@/views/private/details.vue'),
      meta: { title: '团队详情', requiresSwitch: true },
    },
    {
      path: 'stat',
      name: 'stat',
      component: () => import('@/views/stat/index.vue'),
      meta: { title: '统计' },
    },
    {
      path: 'conversation-log',
      name: 'conversation-log',
      component: () => import('@/views/conversation-log/index.vue'),
      meta: { title: '对话日志' },
    },
    {
      path: 'login-log',
      name: 'login-log',
      component: () => import('@/views/login-log/index.vue'),
      meta: { title: '登录日志' },
    },
    {
      path: 'auth-log',
      name: 'auth-log',
      component: () => import('@/views/auth-log/index.vue'),
      meta: { title: '授权日志' },
    },
    {
      path: 'op-log',
      name: 'op-log',
      component: () => import('@/views/op-log/index.vue'),
      meta: { title: '操作日志' },
    },
    {
      path: 'logout',
      name: 'logout',
      component: () => import('@/views/logout/index.vue'),
      meta: { title: '退出' },
    },
    {
      path: 'plugins',
      name: 'plugins',
      component: () => import('@/views/plugins/index.vue'),
      meta: { title: '插件' },
    },
    {
      path: 'addfiles',
      component: () => import('@/views/private/addfiles.vue'),
      meta: { title: '添加文件' },
    },
  ],
};

// 测试路由（仅开发环境）
const testRoutes: RouteRecordRaw = {
  path: '/test',
  component: () => import('@/test/testLayout.vue'),
  children:
    import.meta.env.MODE !== 'production'
      ? [
          {
            path: 'testHitTesting',
            name: 'testHitTesting',
            component: () => import('@/test/testHitTesting.vue'),
            meta: { title: '测试命中' },
          },
          {
            path: 'testCreateFinish',
            name: 'testCreateFinish',
            component: () => import('@/test/testCreateFinish.vue'),
            meta: { title: '测试创建完成' },
          },
          {
            path: 'testSegement',
            name: 'testSegement',
            component: () => import('@/test/testSegement.vue'),
            meta: { title: '测试分段' },
          },
          {
            path: 'testPublic',
            name: 'testPublic',
            component: () => import('@/test/testPublic.vue'),
            meta: { title: '测试公开' },
          },
          {
            path: 'testTeam',
            name: 'testTeam',
            component: () => import('@/test/testPublic.vue'),
            meta: { title: '测试团队' },
          },
        ]
      : [],
};

// 登录路由
const signinRoute: RouteRecordRaw = {
  path: '/signin',
  component: () => import('@/views/signin/index.vue'),
  meta: { title: '登录', public: true },
};

// 404 路由
const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/error/404.vue'),
  meta: { title: '页面不存在' },
};

const routes: RouteRecordRaw[] = [mainRoutes, testRoutes, signinRoute, notFoundRoute];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// 注册路由守卫
setupRouterGuards(router);

export default router;
