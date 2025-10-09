import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "../views/Layout.vue";

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
        path: "public",
        name: "public",
        component: () => import("../views/public/index.vue"),
      },
      {
        path: "permission",
        name: "permission",
        component: () => import("../views/permission/index.vue"),
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
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
