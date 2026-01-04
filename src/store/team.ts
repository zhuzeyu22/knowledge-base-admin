import { Role, Team } from "@/models/team";
import { getRoleList } from "@/service/team";
import { updateCartesianAxisViewCommonPartBuilder } from "echarts/types/src/coord/cartesian/cartesianAxisHelper.js";
import { defineStore } from "pinia";

// 团队知识库（租户）
export const useTeamStore = defineStore("team", {
  state: () => ({
    currentTeam: {} as Team,
    roleList: [] as Role[],
  }),
  getters: {
    getCurrentTeam: (state) => {
      return state.currentTeam;
    },
    getRoleList: (state) => {
      return state.roleList;
    },
  },
  actions: {
    updateCurrentTeam(team: Team) {
      this.currentTeam = team;
    },
    async updateRoleList() {
      const roles = await getRoleList();
      console.log("roles", roles);
      this.roleList = roles.data.results;
    },
  },
});
