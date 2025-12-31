import { getTenantList } from "@/service/team";
import { defineStore } from "pinia";

// 团队知识库（租户）
export const useTeamStore = defineStore("team", {
  state: () => ({
    currentTeam: {},
  }),
  getters: {
    getCurrentTeam: (state) => {
      return state.currentTeam;
    },
  },
  actions: {
    updateCurrentTeam(team: any) {},
  },
});
