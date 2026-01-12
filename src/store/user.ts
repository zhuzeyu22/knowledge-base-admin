import { Profile } from "@/models/user";
import { getFolderPermission } from "@/service/permission";
import { getAccountProfile } from "@/service/workspace";
import { defineStore } from "pinia";

export interface UserInfo {
  account_id: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: {} as Profile,
    // 控制页面菜单显示
    isAdmin: true,
  }),
  getters: {
    getUserInfo: (state) => {
      return state.profile
    },
    getIsAdmin: (state) => {
      return state.isAdmin
    },
  },
  actions: {
    async updateUserInfo() {
      const profile = await getAccountProfile();
      console.log(profile);
      this.profile = profile;
      // todo 接口更新 isAdmin
    },
    async updatePermission() {
      const res = await getFolderPermission()
      console.log('isAdmin', res)
      this.isAdmin = res.is_admin
    }
  },
});
