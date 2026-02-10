import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const mockUserData = {
  id: 'user_001',
  name: 'Admin',
  email: 'admin@example.com',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  role: 'admin',
  tenant_id: 'tenant_001',
}

export default [
  // 获取用户信息
  {
    url: '/console/api/account/profile',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: mockUserData,
        message: 'success',
      }
    },
  },
  // 登录
  {
    url: '/console/api/auth/login',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          access_token: 'mock_token_' + Date.now(),
          token_type: 'Bearer',
          expires_in: 3600,
        },
        message: '登录成功',
      }
    },
  },
  // 获取 Token
  {
    url: '/console/api/oauth/token',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          access_token: 'mock_token_' + Date.now(),
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'mock_refresh_token',
        },
        message: 'success',
      }
    },
  },
  // 获取文件夹权限
  {
    url: '/console/api/get_folder_permission',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          is_admin: true,
          permissions: ['read', 'write', 'delete'],
        },
        message: 'success',
      }
    },
  },
  // 获取登录用户信息
  {
    url: '/console/api/me',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: mockUserData,
        message: 'success',
      }
    },
  },
] satisfies MockMethod[]
