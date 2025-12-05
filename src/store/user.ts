import { defineStore } from 'pinia'

interface UserInfo {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户登录信息
    userInfo: null as UserInfo | null,
    token: localStorage.getItem('token') || '',
    isLoggedIn: false,
    permissions: [] as string[],
    roles: [] as string[]
  }),
  
  actions: {
    // 初始化用户状态
    initialize() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.isLoggedIn = true
        // 这里可以添加从API获取用户信息的逻辑
      }
    },
    
    // 用户登录
    async login(token: string, userInfo?: UserInfo) {
      this.token = token
      this.isLoggedIn = true
      localStorage.setItem('token', token)
      
      if (userInfo) {
        this.userInfo = userInfo
        this.permissions = userInfo.permissions
        this.roles = userInfo.roles
      } else {
        // 实际项目中这里应该调用API获取用户信息
        // 例如: await this.fetchUserInfo(token)
      }
    },
    
    // 用户登出
    logout() {
      this.clearUserInfo()
      // 可以在这里添加登出API调用
    },
    
    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.isLoggedIn = true
      this.permissions = userInfo.permissions
      this.roles = userInfo.roles
    },
    
    // 设置token
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 设置权限
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
    
    // 设置角色
    setRoles(roles: string[]) {
      this.roles = roles
    },
    
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null
      this.token = ''
      this.isLoggedIn = false
      this.permissions = []
      this.roles = []
      localStorage.removeItem('token')
    },
    
    // 检查用户是否已登录
    checkAuth() {
      return this.isLoggedIn && !!this.token
    },
    
    // 获取用户权限
    getUserPermissions() {
      return this.permissions
    },
    
    // 检查用户是否有特定权限
    hasPermission(permission: string) {
      return this.permissions.includes(permission)
    },
    
    // 检查用户是否有特定角色
    hasRole(role: string) {
      return this.roles.includes(role)
    }
  }
})