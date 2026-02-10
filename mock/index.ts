import { MockMethod } from 'vite-plugin-mock'
import userApi from './user.api'
import datasetApi from './dataset.api'
import teamApi from './team.api'
import documentApi from './document.api'

// 合并所有 mock 接口
const mocks: MockMethod[] = [
  ...userApi,
  ...datasetApi,
  ...teamApi,
  ...documentApi,
]

// 为所有 mock 添加延迟
const enableMockDelay = import.meta.env.VITE_MOCK_DELAY !== 'false'
const mockDelay = parseInt(import.meta.env.VITE_MOCK_DELAY || '500')

const mocksWithDelay = mocks.map(mock => ({
  ...mock,
  timeout: enableMockDelay ? mockDelay : 0,
}))

export default mocksWithDelay
