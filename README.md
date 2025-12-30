# 说明

基于 nodejs 18.18.2 进行开发

# 项目初始化过程

npm i -g pnpm
pnpm i -g vite@5
pnpm create vite@5
pnpm i vue-router
pnpm i element-plus

# 运行项目

pnpm run dev

# 环境说明

## 开发环境（临时）

- pnpm run temp

## 开发环境（云桌面）（暂未部署）

- pnpm run dev
- pnpm run build:dev

## 生产环境（终端）

- pnpm run prod
- pnpm run build:prod

# 注意事项
- 20251205 目前使用 temp 和 prod 环境
- 去除了打包时的静态检测 vue-tsc -b &&   ，删除

# 备注
登录统一使用 VITE_SSO_LOGIN_URL 访问
在 nginx 配置重定向至正确的 url
开发环境使用 https://ai.bobfintech.com.cn/iam/login
生产环境使用 http://10.51.228.125:8080
需要注意配置，参数 client_id=KNOW 这里的 KNOW 取实际使用的 id

```
# nginx 配置参考
location /idp/oauth2/authorize {
    set $args "$args$client_id=KNOW"
    return 302 http://10.51.228.125:8080/idp/oauth2/authorize?$args;
}

```
