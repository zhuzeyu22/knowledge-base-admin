import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 生成模拟知识库数据
const generateDatasets = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `dataset_${index + 1}`,
    name: Mock.Random.ctitle(5, 15),
    description: Mock.Random.cparagraph(1, 3),
    document_count: Mock.Random.integer(0, 100),
    word_count: Mock.Random.integer(1000, 100000),
    app_count: Mock.Random.integer(0, 10),
    created_at: Mock.Random.datetime(),
    updated_at: Mock.Random.datetime(),
    created_by: Mock.Random.cname(),
    status: Mock.Random.pick(['active', 'processing', 'error']),
    index_type: Mock.Random.pick(['high_quality', 'economy']),
    embedding_model: 'text-embedding-ada-002',
    retrieval_mode: Mock.Random.pick(['vector', 'fulltext', 'hybrid']),
    tags: Mock.Random.range(0, 5).map(() => Mock.Random.cword(2, 4)),
  }))
}

const mockDatasets = generateDatasets(15)

export default [
  // 获取知识库列表
  {
    url: '/console/api/datasets',
    method: 'get',
    response: ({ query }: { query: { page?: string; limit?: string; search?: string } }) => {
      const page = parseInt(query.page || '1')
      const limit = parseInt(query.limit || '10')
      const search = query.search || ''
      
      let filtered = mockDatasets
      if (search) {
        filtered = mockDatasets.filter(d => 
          d.name.includes(search) || d.description.includes(search)
        )
      }
      
      const start = (page - 1) * limit
      const end = start + limit
      
      return {
        code: 200,
        data: {
          list: filtered.slice(start, end),
          total: filtered.length,
          page,
          limit,
        },
        message: 'success',
      }
    },
  },
  // 获取知识库详情
  {
    url: '/console/api/datasets/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      const dataset = mockDatasets.find(d => d.id === params.id) || mockDatasets[0]
      return {
        code: 200,
        data: dataset,
        message: 'success',
      }
    },
  },
  // 创建知识库
  {
    url: '/console/api/datasets',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const newDataset = {
        id: `dataset_${Date.now()}`,
        ...body,
        document_count: 0,
        word_count: 0,
        app_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'Admin',
        status: 'active',
      }
      mockDatasets.unshift(newDataset)
      return {
        code: 201,
        data: newDataset,
        message: '创建成功',
      }
    },
  },
  // 更新知识库
  {
    url: '/console/api/datasets/:id',
    method: 'put',
    response: ({ params, body }: { params: { id: string }; body: any }) => {
      const index = mockDatasets.findIndex(d => d.id === params.id)
      if (index > -1) {
        mockDatasets[index] = { ...mockDatasets[index], ...body, updated_at: new Date().toISOString() }
        return {
          code: 200,
          data: mockDatasets[index],
          message: '更新成功',
        }
      }
      return {
        code: 404,
        message: '知识库不存在',
      }
    },
  },
  // 删除知识库
  {
    url: '/console/api/datasets/:id',
    method: 'delete',
    response: ({ params }: { params: { id: string } }) => {
      const index = mockDatasets.findIndex(d => d.id === params.id)
      if (index > -1) {
        mockDatasets.splice(index, 1)
        return {
          code: 200,
          message: '删除成功',
        }
      }
      return {
        code: 404,
        message: '知识库不存在',
      }
    },
  },
] satisfies MockMethod[]
