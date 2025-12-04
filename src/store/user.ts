import { defineStore } from 'pinia'

//  `defineStore()` 的返回值的命名是自由的
// 但最好含有 store 的名字，且以 `use` 开头，以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户登录信息
    userInfo: null,
    token: localStorage.getItem('token') || '',
  }),
  
  actions: {
    // 设置用户信息
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
    
    // 设置token
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})