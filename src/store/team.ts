import { Role, Team } from "@/models/team";
import { getRoleList, getUserRole } from "@/service/team";
import { Permission } from "@/utils/permission";
import { defineStore } from "pinia";
import { useUserStore } from "@/store/user";
import { getRolePermissionNameList } from "@/service/tenant";

// 团队知识库（租户）
export const useTeamStore = defineStore("team", {
  state: () => ({
    currentTeam: {} as Team,
    roleList: [] as Role[],
    role: {} as Role,
    // 这里的权限只给团队模块使用
    permissions: [] as Permission[],
  }),
  getters: {
    getCurrentTeam: (state) => {
      return state.currentTeam;
    },
    getRoleList: (state) => {
      return state.roleList;
    },
    getPermissions: (state) => {
      return state.permissions;
    },
  },
  actions: {
    async updateCurrentTeam(team: Team) {
      this.currentTeam = team;
      await this.updateRoleList(); // 更新角色列表
      await this.updateRole(); // 更新当前用户角色
      await this.updatePermissions(); // 更新当前用户权限
    },
    async updateCurrentTeamById(tenantId: string) {
      const userStore = useUserStore();
      const account_id = userStore.getUserInfo?.id;
      await this.updateRoleList(); // 更新角色列表
      await this.updateRoleById(tenantId, account_id); // 更新当前用户角色
      await this.updatePermissions(); // 更新当前用户权限
    },
    async updateRoleList() {
      const roles = await getRoleList();
      console.log("roles", roles);
      this.roleList = roles.data.results;
    },
    async updateRole() {
      const userStore = useUserStore();
      const account_id = userStore.getUserInfo?.id;
      const tenant_id = this.currentTeam?.tenant_id;
      if (account_id && tenant_id) {
        this.role = await getUserRole(tenant_id, account_id);
      }
    },
    async updateRoleById(tenantId: string, accountId: string) {
      if (accountId && tenantId) {
        this.role = await getUserRole(tenantId, accountId);
      }
    },
    async updatePermissions() {
      const permissions = await getRolePermissionNameList(this.role.id);
      this.permissions = permissions.data;
      return permissions;
    },
  },
});
