import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/views/Layout.vue";
import { getQueryParam } from "@/utils/params";
import { accessUnitlogin } from "@/utils/auth";
import { getTenantList, postSwitchWorkspace } from "@/service/team";
import { getAccountProfile } from "@/service/workspace";
import { useTeamStore } from "@/store/team";
import { useUserStore } from "@/store/user";

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/private",
    children: [
      {
        path: "private",
        name: "private",
        component: () => import("@/views/private/index.vue"),
        beforeEnter: async () => {
          // 切换回个人知识库
          try {
            const profile = await getAccountProfile();
            const account_id = profile.id;
            let teamList = []
            let page = 1
            let limit = 50
            let nowIndex = -1
            let total = 1
            while (nowIndex < total) {
              const res = await getTenantList(
                account_id,
                page,
                limit,
              )
              teamList.push(...res.data.results)
              nowIndex = page * limit
              total = res.data.count
              page++
            }
            const findPrivate = teamList.find(t => t.is_public == false && t.account_id == account_id)
            const tenantId = findPrivate?.tenant_id || ''
            // 调用 switch 接口
            await postSwitchWorkspace(tenantId);
            // 成功则继续导航
          } catch (error) {
            console.error(error);
          }
          return true
        },
      },
      {
        path: "create",
        name: "create",
        component: () => import("@/views/private/create/index.vue"),
      },
      {
        path: "details",
        name: "details",
        component: () => import("@/views/private/details.vue"),
      },
      {
        path: "public",
        name: "public",
        component: () => import("@/views/public/index.vue"),
      },
      {
        path: "team",
        name: "team",
        component: () => import("@/views/team/blank.vue"),
      },
      // 团队知识库列表
      {
        path: "team/:teamId/datasets",
        component: () => import("@/views/team/index.vue"),
        meta: { requiresSwitch: true }, // 标记需要调用 switch 接口
      },
      // 创建团队知识库
      {
        path: "team/:teamId/create",
        component: () => import("@/views/private/create/index.vue"),
        meta: { requiresSwitch: true }, // 标记需要调用 switch 接口
      },
      // 团队知识库详情
      {
        path: "team/:teamId/dataset/:datasetId",
        component: () => import("@/views/team/index.vue"),
        meta: { requiresSwitch: true }, // 标记需要调用 switch 接口
      },
      {
        path: "team/:teamId/member",
        component: () => import("@/views/team/member.vue"),
        meta: { requiresSwitch: true }, // 标记需要调用 switch 接口
      },
      {
        path: "team/:teamId/setting",
        component: () => import("@/views/team/setting.vue"),
        meta: { requiresSwitch: true }, // 标记需要调用 switch 接口
      },
      {
        path: "stat",
        name: "stat",
        component: () => import("@/views/stat/index.vue"),
      },
      {
        path: "conversation-log",
        name: "conversation-log",
        component: () => import("@/views/conversation-log/index.vue"),
      },
      {
        path: "login-log",
        name: "login-log",
        component: () => import("@/views/login-log/index.vue"),
      },
      {
        path: "auth-log",
        name: "auth-log",
        component: () => import("@/views/auth-log/index.vue"),
      },
      {
        path: "op-log",
        name: "op-log",
        component: () => import("@/views/op-log/index.vue"),
      },
      {
        path: "logout",
        name: "logout",
        component: () => import("@/views/logout/index.vue"),
      },
      {
        path: "plugins",
        name: "plugins",
        component: () => import("@/views/plugins/index.vue"),
      },
      {
        path: "addfiles",
        component: () => import("@/views/private/addfiles.vue"),
      },
    ],
  },
  {
    path: "/signin",
    component: () => import("@/views/signin/index.vue"),
  },
  {
    path: "/test",
    component: () => import("@/test/testLayout.vue"),
    children:
      import.meta.env.MODE !== "production"
        ? [
          {
            path: "testHitTesting",
            name: "testHitTesting",
            component: () => import("@/test/testHitTesting.vue"),
          },
          {
            path: "testCreateFinish",
            name: "testCreateFinish",
            component: () => import("@/test/testCreateFinish.vue"),
          },
          {
            path: "testSegement",
            name: "testSegement",
            component: () => import("@/test/testSegement.vue"),
          },
          {
            path: "testPublic",
            name: "testPublic",
            component: () => import("@/test/testPublic.vue"),
          },
          {
            path: "testTeam",
            name: "testTeam",
            component: () => import("@/test/testPublic.vue"),
          },
        ]
        : [],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const code = getQueryParam("code");
  if (code) {
    await accessUnitlogin({ code });
    const cleanUrl =
      window.location.origin + window.location.pathname + window.location.hash;
    window.location.replace(cleanUrl);
  }

  // 检查是否需要切换团队
  if (to.meta.requiresSwitch && to.params.teamId) {
    const teamId = String(to.params.teamId);
    try {
      // 调用 switch 接口
      await postSwitchWorkspace(teamId);
      // 更新相关的权限信息
      const teamStore = useTeamStore();
      await teamStore.updateCurrentTeamById(teamId);
      // 成功则继续导航
    } catch (error) {
      console.error("切换团队失败:", error);
      // 可选：跳转到错误页或首页
    }
  }
});

export default router;
