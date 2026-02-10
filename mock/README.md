# Mock 数据说明

本目录包含纯前端开发环境使用的 Mock API 数据。

## 文件结构

```
mock/
├── index.ts           # Mock 入口，合并所有 API
├── user.api.ts        # 用户相关接口
├── dataset.api.ts     # 知识库相关接口
├── team.api.ts        # 团队相关接口
├── document.api.ts    # 文档相关接口
└── README.md          # 本文件
```

## 使用方式

### 1. 启动 Mock 开发环境

```bash
pnpm run mock
```

或

```bash
pnpm run dev:mock
```

### 2. 配置说明

Mock 环境配置在 `.env.mock` 文件中：

```env
VITE_USE_MOCK=true          # 启用 Mock
VITE_MOCK_DELAY=500         # Mock 响应延迟（毫秒）
VITE_ENABLE_DEVTOOLS=true   # 启用 Vue DevTools
```

### 3. 添加新的 Mock 接口

1. 在对应 `.api.ts` 文件中添加接口配置
2. 参考示例：

```typescript
{
  url: '/console/api/your-api',
  method: 'get', // get, post, put, delete
  response: ({ query, body, params }) => {
    return {
      code: 200,
      data: {},
      message: 'success',
    }
  },
}
```

## 现有接口列表

### 用户相关
- `GET /console/api/account/profile` - 获取用户信息
- `POST /console/api/auth/login` - 登录
- `POST /console/api/oauth/token` - 获取 Token
- `GET /console/api/get_folder_permission` - 获取权限
- `GET /console/api/me` - 获取当前用户

### 知识库相关
- `GET /console/api/datasets` - 获取知识库列表
- `GET /console/api/datasets/:id` - 获取知识库详情
- `POST /console/api/datasets` - 创建知识库
- `PUT /console/api/datasets/:id` - 更新知识库
- `DELETE /console/api/datasets/:id` - 删除知识库

### 团队相关
- `GET /tenant/api/teams` - 获取团队列表
- `POST /tenant/api/switch-workspace` - 切换工作空间
- `GET /tenant/api/teams/:id/members` - 获取团队成员
- `POST /tenant/api/teams` - 创建团队
- `PUT /tenant/api/teams/:id` - 更新团队

### 文档相关
- `GET /console/api/datasets/:datasetId/documents` - 获取文档列表
- `GET /console/api/documents/:id` - 获取文档详情
- `POST /console/api/datasets/:datasetId/documents` - 上传文档
- `DELETE /console/api/documents/:id` - 删除文档
- `PUT /console/api/documents/:id/status` - 更新文档状态
