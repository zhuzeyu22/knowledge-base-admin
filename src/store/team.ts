import { Role, Team } from "@/models/team";
import { getRoleList, getTenantList, getUserRole } from "@/service/team";
import { Permission } from "@/utils/permission";
import { defineStore } from "pinia";
import { useUserStore } from "@/store/user";
import { getRolePermissionNameList } from "@/service/tenant";

// 团队知识库（租户）
export const useTeamStore = defineStore("team", {
  state: () => ({
    // 没必要
    // teamList: [] as Team[],
    // private
    privateTenantId: '',
    currentTeam: {} as Team,
    roleList: [] as Role[],
    role: {} as Role,
    // 这里的权限只给团队模块使用
    permissions: [] as Permission[],
    // 触发更新团队列表
    refreshToken: 1,
    // 是否有创建权限
    createPermission: false,
  }),
  getters: {
    getPrivateTenantId: (state) => {
      return state.privateTenantId
    },
    // getTeamList: (state) => {
    //   return state.teamList
    // },
    getCurrentTeam: (state) => {
      return state.currentTeam;
    },
    getRoleList: (state) => {
      return state.roleList;
    },
    getPermissions: (state) => {
      return state.permissions;
    },
    getRefresh: (state) => {
      return state.refreshToken
    },
    getCreatePermission: (state) => {
      return state.createPermission
    }
  },
  actions: {
    async updatePrivateTenantId() {
      const userStore = useUserStore();
      const account_id = userStore.getUserInfo?.id;
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
      this.privateTenantId = findPrivate?.tenant_id || ''
      // console.log('this.privateTenantId', this.privateTenantId, account_id, teamList)
    },
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
    refreshTeamList() {
      this.refreshToken = this.refreshToken + 1
    },
    updateCreatePermission(c: boolean) {
      return this.createPermission = c
    }
  },
});
