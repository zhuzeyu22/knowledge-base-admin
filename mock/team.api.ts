import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 生成模拟团队数据
const generateTeams = () => {
  return [
    {
      tenant_id: 'tenant_001',
      name: '个人空间',
      description: '我的个人知识库',
      is_public: false,
      account_id: 'user_001',
      member_count: 1,
      dataset_count: 5,
      created_at: Mock.Random.datetime(),
      role: 'owner',
    },
    ...Array.from({ length: 5 }, (_, index) => ({
      tenant_id: `team_${index + 2}`,
      name: Mock.Random.ctitle(3, 8) + '团队',
      description: Mock.Random.cparagraph(1, 2),
      is_public: true,
      account_id: `user_0${index + 2}`,
      member_count: Mock.Random.integer(2, 20),
      dataset_count: Mock.Random.integer(0, 10),
      created_at: Mock.Random.datetime(),
      role: Mock.Random.pick(['owner', 'admin', 'member']),
    })),
  ]
}

const mockTeams = generateTeams()

export default [
  // 获取团队列表
  {
    url: '/tenant/api/teams',
    method: 'get',
    response: ({ query }: { query: { page?: string; limit?: string } }) => {
      const page = parseInt(query.page || '1')
      const limit = parseInt(query.limit || '10')
      const start = (page - 1) * limit
      const end = start + limit
      
      return {
        code: 200,
        data: {
          results: mockTeams.slice(start, end),
          count: mockTeams.length,
          page,
          limit,
        },
        message: 'success',
      }
    },
  },
  // 切换工作空间
  {
    url: '/tenant/api/switch-workspace',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          current_tenant: mockTeams[0],
        },
        message: '切换成功',
      }
    },
  },
  // 获取团队成员
  {
    url: '/tenant/api/teams/:id/members',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const members = Array.from({ length: 10 }, (_, index) => ({
        id: `member_${index + 1}`,
        name: Mock.Random.cname(),
        email: Mock.Random.email(),
        avatar: Mock.Random.image('100x100'),
        role: Mock.Random.pick(['owner', 'admin', 'member']),
        joined_at: Mock.Random.datetime(),
      }))
      
      return {
        code: 200,
        data: {
          list: members,
          total: members.length,
        },
        message: 'success',
      }
    },
  },
  // 创建团队
  {
    url: '/tenant/api/teams',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const newTeam = {
        tenant_id: `team_${Date.now()}`,
        ...body,
        is_public: true,
        member_count: 1,
        dataset_count: 0,
        created_at: new Date().toISOString(),
        role: 'owner',
      }
      mockTeams.push(newTeam)
      return {
        code: 201,
        data: newTeam,
        message: '创建成功',
      }
    },
  },
  // 更新团队
  {
    url: '/tenant/api/teams/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: any }) => {
      const index = mockTeams.findIndex(t => t.tenant_id === params.id)
      if (index > -1) {
        mockTeams[index] = { ...mockTeams[index], ...body }
        return {
          code: 200,
          data: mockTeams[index],
          message: '更新成功',
        }
      }
      return {
        code: 404,
        message: '团队不存在',
      }
    },
  },
] satisfies MockMethod[]
