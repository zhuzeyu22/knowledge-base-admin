# 开发环境指南

本文档介绍项目的开发环境配置和使用方式。

## 环境模式

项目支持以下开发模式：

| 模式 | 命令 | 说明 |
|------|------|------|
| `development` | `pnpm dev` | 连接后端开发环境 |
| `temp` | `pnpm temp` | 临时环境 |
| `mock` | `pnpm mock` / `pnpm dev:mock` | **纯前端开发（使用 Mock 数据）** |
| `production` | `pnpm prod` | 生产环境预览 |

## 纯前端开发（Mock 模式）

### 快速开始

```bash
# 启动 Mock 开发环境
pnpm mock

# 或
pnpm dev:mock
```

### 特点

- ✅ 无需后端服务，独立开发
- ✅ 模拟真实 API 响应
- ✅ 支持响应延迟配置
- ✅ 包含丰富的模拟数据

### 配置文件

Mock 环境配置：`.env.mock`

```env
# 启用 Mock
VITE_USE_MOCK=true

# Mock 响应延迟（毫秒）
VITE_MOCK_DELAY=500

# 启用开发工具
VITE_ENABLE_DEVTOOLS=true
```

### Mock 数据范围

当前 Mock 包含以下模块：

#### 1. 用户模块 (`mock/user.api.ts`)
- 用户登录/登出
- 获取用户信息
- 获取权限

#### 2. 知识库模块 (`mock/dataset.api.ts`)
- 知识库列表（分页、搜索）
- 知识库增删改查
- 知识库详情

#### 3. 团队模块 (`mock/team.api.ts`)
- 团队列表
- 切换工作空间
- 团队成员管理
- 团队增删改查

#### 4. 文档模块 (`mock/document.api.ts`)
- 文档列表（分页）
- 文档详情（含分段）
- 文档上传
- 文档状态管理

### 添加新的 Mock 接口

1. 在对应 `.api.ts` 文件中添加接口：

```typescript
{
  url: '/console/api/your-api',
  method: 'get',
  response: ({ query, body, params }) => {
    return {
      code: 200,
      data: {
        // 你的数据
      },
      message: 'success',
    }
  },
}
```

2. 在 `mock/index.ts` 中导入并合并

## 连接后端开发

### 开发环境

```bash
pnpm dev
```

配置：`.env.development`

```env
VITE_SERVER_PROXY_BASE_URL=http://172.16.6.129:30720
```

### 临时环境

```bash
pnpm temp
```

配置：`.env.temp`

```env
VITE_SERVER_PROXY_BASE_URL=http://www.finna.com.cn
```

## 构建命令

```bash
# 生产构建
pnpm build

# 开发环境构建
pnpm build:dev

# Mock 环境构建
pnpm build:mock
```

## 代码规范

```bash
# 检查代码
pnpm lint

# 自动修复
pnpm lint:fix

# 格式化代码
pnpm format
```

## 项目结构

```
.
├── .env.development     # 开发环境配置
├── .env.production      # 生产环境配置
├── .env.temp            # 临时环境配置
├── .env.mock            # Mock 环境配置
├── mock/                # Mock 数据
│   ├── index.ts         # Mock 入口
│   ├── user.api.ts      # 用户接口
│   ├── dataset.api.ts   # 知识库接口
│   ├── team.api.ts      # 团队接口
│   └── document.api.ts  # 文档接口
├── src/
│   ├── service/         # API 请求封装
│   ├── store/           # 状态管理
│   ├── router/          # 路由配置
│   └── ...
└── vite.config.ts       # Vite 配置
```

## 常见问题

### Q: Mock 数据如何模拟延迟？

A: 在 `.env.mock` 中设置 `VITE_MOCK_DELAY`，单位为毫秒。设为 `0` 可禁用延迟。

### Q: 如何切换回真实后端？

A: 使用 `pnpm dev` 或 `pnpm temp` 命令启动，而不是 `pnpm mock`。

### Q: 修改 Mock 数据后需要重启吗？

A: 不需要，Vite 会自动热更新。

### Q: 如何添加新的 Mock 接口？

A: 参考 [Mock 数据说明](./mock/README.md)

## 相关文档

- [Mock 数据说明](./mock/README.md)
- [Vite 配置](./vite.config.ts)
