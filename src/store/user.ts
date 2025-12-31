import { Profile } from "@/models/user";
import { getAccountProfile } from "@/service/workspace";
import { defineStore } from "pinia";

export interface UserInfo {
  account_id: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: {} as Profile,
  }),
  getters: {
    getUserInfo: (state) => state.profile,
  },
  actions: {
    async updateUserInfo() {
      const profile = await getAccountProfile();
      console.log(profile);
      this.profile = profile;
    },
  },
});
