import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "../views/Layout.vue";
import { getQueryParam } from "../utils/params";

const routes = [
  {
    path: "/",
    component: Layout,
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
        path: "plugins",
        name: "plugins",
        component: () => import("../views/plugins/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const maasUser = getQueryParam("certifiedName");
  console.log("maasUser", maasUser);
  if (maasUser) {
    localStorage.setItem("maasUser", maasUser);
  }
  return true;
})

export default router;
