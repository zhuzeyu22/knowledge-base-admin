import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/views/Layout.vue";
import { getQueryParam } from "@/utils/params";
import { accessUnitlogin } from "@/utils/auth";

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/private",
    children: [
      {
        path: "private",
        name: "private",
        component: () => import("../views/private/index.vue"),
      },
      {
        path: "create",
        name: "create",
        component: () => import("../views/private/create/index.vue"),
      },
      {
        path: "details",
        name: "details",
        component: () => import("../views/private/details.vue"),
      },
      {
        path: "public",
        name: "public",
        component: () => import("../views/public/index.vue"),
      },
      {
        path: "stat",
        name: "stat",
        component: () => import("../views/stat/index.vue"),
      },
      {
        path: "conversation-log",
        name: "conversation-log",
        component: () => import("../views/conversation-log/index.vue"),
      },
      {
        path: "login-log",
        name: "login-log",
        component: () => import("../views/login-log/index.vue"),
      },
      {
        path: "auth-log",
        name: "auth-log",
        component: () => import("../views/auth-log/index.vue"),
      },
      {
        path: "logout",
        name: "logout",
        component: () => import("../views/logout/index.vue"),
      },
      {
        path: "hitTesting",
        name: "hitTesting",
        component: () => import("../test/testHitTesting.vue"),
      },
      {
        path: "createFinish",
        name: "createFinish",
        component: () => import("../test/testCreateFinish.vue"),
      },
      {
        path: "segement",
        name: "segement",
        component: () => import("../test/testSegement.vue"),
      },
      {
        path: "plugins",
        name: "plugins",
        component: () => import("../views/plugins/index.vue"),
      },
      {
        path: "/addfiles",
        component: () => import("../views/private/addfiles.vue"),
      },
    ],
  },{
    path: "/signin",
    component: () => import("../views/signin/index.vue"),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const code = getQueryParam("code");
  if (code) {
    await accessUnitlogin()
    const cleanUrl =
      window.location.origin + window.location.pathname + window.location.hash;
    window.location.replace(cleanUrl);
  }
});

export default router;
