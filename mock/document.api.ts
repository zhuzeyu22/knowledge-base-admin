import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 生成模拟文档数据
const generateDocuments = (datasetId: string, count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `doc_${datasetId}_${index + 1}`,
    name: Mock.Random.ctitle(5, 20) + Mock.Random.pick(['.pdf', '.docx', '.txt', '.md']),
    dataset_id: datasetId,
    type: Mock.Random.pick(['pdf', 'docx', 'txt', 'md', 'html']),
    size: Mock.Random.integer(1024, 10485760),
    word_count: Mock.Random.integer(100, 50000),
    segment_count: Mock.Random.integer(1, 100),
    status: Mock.Random.pick(['completed', 'processing', 'error', 'paused']),
    display_status: Mock.Random.pick(['enabled', 'disabled', 'error']),
    hit_count: Mock.Random.integer(0, 1000),
    created_at: Mock.Random.datetime(),
    updated_at: Mock.Random.datetime(),
    created_by: Mock.Random.cname(),
    indexing_status: Mock.Random.pick(['completed', 'indexing', 'error']),
  }))
}

const mockDocumentsMap = new Map<string, any[]>()

export default [
  // 获取文档列表
  {
    url: '/console/api/datasets/:datasetId/documents',
    method: 'get',
    response: ({ params, query }: { params: { datasetId: string }; query: any }) => {
      const { datasetId } = params
      const page = parseInt(query.page || '1')
      const limit = parseInt(query.limit || '10')
      
      if (!mockDocumentsMap.has(datasetId)) {
        mockDocumentsMap.set(datasetId, generateDocuments(datasetId, 25))
      }
      
      const documents = mockDocumentsMap.get(datasetId) || []
      const start = (page - 1) * limit
      const end = start + limit
      
      return {
        code: 200,
        data: {
          list: documents.slice(start, end),
          total: documents.length,
          page,
          limit,
        },
        message: 'success',
      }
    },
  },
  // 获取文档详情
  {
    url: '/console/api/documents/:id',
    method: 'get',
    response: ({ params }: { params: { id: string } }) => {
      return {
        code: 200,
        data: {
          id: params.id,
          name: Mock.Random.ctitle(5, 20) + '.pdf',
          content: Mock.Random.cparagraph(10, 50),
          segments: Array.from({ length: 10 }, (_, i) => ({
            id: `seg_${i + 1}`,
            content: Mock.Random.cparagraph(2, 5),
            word_count: Mock.Random.integer(50, 500),
            status: 'completed',
          })),
        },
        message: 'success',
      }
    },
  },
  // 上传文档
  {
    url: '/console/api/datasets/:datasetId/documents',
    method: 'post',
    response: ({ params, body }: { params: { datasetId: string }; body: any }) => {
      const newDoc = {
        id: `doc_${Date.now()}`,
        dataset_id: params.datasetId,
        name: body.name || Mock.Random.ctitle(5, 15) + '.pdf',
        type: 'pdf',
        size: Mock.Random.integer(1024, 10485760),
        word_count: 0,
        segment_count: 0,
        status: 'processing',
        display_status: 'enabled',
        hit_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'Admin',
        indexing_status: 'indexing',
      }
      
      const docs = mockDocumentsMap.get(params.datasetId) || []
      docs.unshift(newDoc)
      mockDocumentsMap.set(params.datasetId, docs)
      
      return {
        code: 201,
        data: newDoc,
        message: '上传成功',
      }
    },
  },
  // 删除文档
  {
    url: '/console/api/documents/:id',
    method: 'delete',
    response: () => {
      return {
        code: 200,
        message: '删除成功',
      }
    },
  },
  // 更新文档状态
  {
    url: '/console/api/documents/:id/status',
    method: 'put',
    response: ({ body }: { body: { display_status?: string } }) => {
      return {
        code: 200,
        data: {
          display_status: body.display_status || 'enabled',
        },
        message: '更新成功',
      }
    },
  },
] satisfies MockMethod[]
