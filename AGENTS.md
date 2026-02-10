# 知识库管理平台 (Knowledge Base Admin)

## 项目概述

这是一个基于 Vue 3 + TypeScript 开发的知识库管理后台系统，提供个人知识库、团队知识库、公共知识库的管理功能，支持文档上传、分段设置、检索配置、权限管理等功能。

## 技术栈

### 核心技术
- **框架**: Vue 3 (Composition API) + TypeScript
- **构建工具**: Vite 5
- **UI 组件库**: Element Plus (中文本地化)
- **状态管理**: Pinia
- **路由**: Vue Router 4 (Hash 模式)
- **样式**: Less + SCSS + CSS
- **图表**: ECharts 6

### 开发工具
- **包管理器**: pnpm (推荐) / npm
- **Node 版本**: 18.18.2+
- **代码规范**: ESLint + Prettier + TypeScript
- **Git 钩子**: Husky + lint-staged
- **提交规范**: Commitizen (cz-conventional-changelog)

### 其他依赖
- **HTTP 客户端**: Axios
- **加密**: jsencrypt
- **工具库**: lodash
- **Mock 数据**: mockjs + vite-plugin-mock

## 项目结构

```
.
├── mock/                          # Mock 数据目录
│   └── console.api.ts            # API Mock 配置
├── src/
│   ├── assets/                   # 静态资源
│   │   ├── less/                # Less 样式文件
│   │   ├── dataset-setting/     # 知识库配置相关图片
│   │   └── *.png                # 其他图片资源
│   ├── components/              # 公共组件
│   │   ├── createCard/          # 创建卡片组件
│   │   ├── datasetSetting/      # 知识库设置相关组件
│   │   ├── uploadFiles/         # 文件上传组件
│   │   ├── publicTree/          # 公共知识库树组件
│   │   └── teamTree/            # 团队知识库树组件
│   ├── models/                  # TypeScript 类型定义
│   │   ├── dataset.ts          # 知识库相关类型
│   │   ├── document.ts         # 文档相关类型
│   │   ├── organization.ts     # 组织相关类型
│   │   ├── segement.ts         # 分段相关类型
│   │   ├── team.ts             # 团队相关类型
│   │   └── user.ts             # 用户相关类型
│   ├── router/                  # 路由配置
│   │   └── index.ts            # 路由主配置
│   ├── service/                 # API 服务层
│   │   ├── api.ts              # API 接口封装
│   │   ├── auth.ts             # 认证相关接口
│   │   ├── datasets.ts         # 知识库接口
│   │   ├── document.ts         # 文档接口
│   │   ├── request.ts          # Axios 请求拦截器
│   │   ├── knowledge/          # 知识库业务逻辑封装
│   │   └── ...
│   ├── store/                   # Pinia 状态管理
│   │   ├── user.ts             # 用户状态
│   │   ├── team.ts             # 团队状态
│   │   └── workspace.ts        # 工作空间状态
│   ├── utils/                   # 工具函数
│   │   ├── auth.ts             # 认证工具
│   │   ├── encrypt.ts          # 加密工具
│   │   ├── permission.ts       # 权限工具
│   │   ├── params.ts           # URL 参数处理
│   │   └── time.ts             # 时间处理
│   ├── views/                   # 页面视图
│   │   ├── private/            # 个人知识库
│   │   ├── public/             # 公共知识库
│   │   ├── team/               # 团队知识库
│   │   ├── stat/               # 数据统计
│   │   ├── signin/             # 登录页
│   │   └── ...                 # 其他功能页面
│   ├── test/                    # 测试页面(非生产环境)
│   ├── main.ts                  # 应用入口
│   ├── App.vue                  # 根组件
│   └── style.css               # 全局样式
├── .env.development            # 开发环境配置
├── .env.production             # 生产环境配置
├── .env.temp                   # 临时环境配置
├── Dockerfile                  # Docker 构建配置
├── index.html                  # HTML 模板
├── package.json                # 依赖配置
├── tsconfig.json               # TypeScript 配置
└── vite.config.ts              # Vite 配置
```

## 环境配置

### 环境变量说明

| 变量名 | 说明 | 使用场景 |
|--------|------|----------|
| `VITE_API_BASE_URL` | 主 API 基础路径 | `/console/api` |
| `VITE_TENANT_API_BASE_URL` | 租户 API 基础路径 | `/tenant/api` |
| `VITE_SSO_LOGIN_URL` | SSO 登录地址 | `/idp/oauth2/authorize` |
| `VITE_SERVER_PROXY_BASE_URL` | 后端代理目标地址 | 开发调试使用 |
| `VITE_SERVER_PROXY_SSO_LOGIN_URL` | 登录系统代理地址 | 开发调试使用 |

### 环境文件

- `.env.temp` - 临时开发环境（当前主要使用）
- `.env.development` - 开发环境（云桌面，暂未部署）
- `.env.production` - 生产环境（终端）

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动临时开发环境（当前主要使用）
pnpm run temp

# 启动开发环境
pnpm run dev

# 启动生产环境预览
pnpm run prod

# 构建生产环境
pnpm run build

# 预览构建产物
pnpm run preview
```

## 开发规范

### 代码风格

- 使用 **TypeScript** 进行类型检查，严格模式开启
- 使用 **Composition API** 编写 Vue 组件
- 组件使用 `<script setup lang="ts">` 语法
- 样式优先使用 **Less/SCSS**，支持 scoped 样式
- 路径别名 `@/` 指向 `src/` 目录

### 命名规范

- 组件文件: PascalCase (如 `KnowledgeBaseCard.vue`)
- 工具函数: camelCase (如 `getAccessToken`)
- 类型定义: PascalCase (如 `Dataset`, `UserInfo`)
- 枚举: PascalCase (如 `RETRIEVE_TYPE`, `ProcessMode`)
- Store: camelCase 命名，以 `use` 开头 (如 `useUserStore`)

### 目录组织

- `views/` - 按功能模块组织子目录
- `components/` - 按功能或页面组织子目录
- `service/` - 按业务模块组织，复杂业务可建子目录
- `models/` - 按实体类型组织类型定义文件

## 核心功能模块

### 1. 知识库管理
- 个人知识库 (Private)
- 团队知识库 (Team)
- 公共知识库 (Public)

### 2. 文档管理
- 文档上传 (支持多种格式: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, HTML, Markdown)
- 文档分段设置
- 文档检索测试

### 3. 检索配置
- 检索方式: 语义检索、全文检索、混合检索
- Rerank 配置
- 权重设置
- Top-K 设置

### 4. 权限管理
- 基于角色的权限控制 (RBAC)
- 团队权限管理
- 管理员/普通用户区分

### 5. 日志管理
- 对话记录
- 登录记录
- 授权记录
- 操作记录

## 认证流程

系统采用 OAuth2 单点登录 (SSO) 认证:

1. **开发环境**: 跳转至本地登录页 `/signin`
2. **生产环境**: 
   - 跳转至 SSO 登录页获取 code
   - 通过 code 换取 access_token
   - token 存储在 localStorage (`console_token`)
   - 请求自动携带 `Authorization: Bearer {token}` 头部

### 本地存储键值

| Key | 说明 |
|-----|------|
| `console_token` | 访问令牌 |
| `authId` | 用户 ID |
| `roleId` | 角色 ID |
| `userName` | 用户名 |

## 代理配置

Vite 开发服务器配置了以下代理规则:

- `/console` -> 后端 API
- `/tenant` -> 租户 API
- `/statistics` -> 统计 API
- `/datasets` -> 数据集 API
- `/idp/oauth2/authorize` -> SSO 登录服务

代理目标地址根据环境变量动态配置。

## 部署说明

### Docker 构建

项目包含 Dockerfile，使用多阶段构建:

1. **构建阶段**: Node 20 Alpine 环境
   - 使用私有 npm 镜像源
   - 安装 pnpm 并执行构建

2. **发布阶段**: Nginx 1.25.2
   - 暴露 8080 端口
   - 时区设置为 Asia/Shanghai

### Nginx 配置参考

SSO 登录需要在 Nginx 配置重定向:

```nginx
location /idp/oauth2/authorize {
    set $args "$args&client_id=KNOW"
    return 302 http://10.51.228.125:8080/idp/oauth2/authorize?$args;
}
```

## 测试

- 非生产环境 (`MODE !== "production"`) 可访问 `/test` 路径下的测试页面
- Mock 数据在 `mock/` 目录配置，通过 `vite-plugin-mock` 启用

## 注意事项

1. **TypeScript 检查**: 生产构建时暂时关闭了 `vue-tsc` 静态检查
2. **超时设置**: API 请求超时时间为 60 秒（考虑回归测试查询较慢）
3. **当前使用环境**: `temp` 和 `prod` 环境
4. **client_id 配置**: 生产环境需要在 Nginx 中配置 `client_id=KNOW`
