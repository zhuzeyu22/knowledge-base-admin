# 构建阶段
FROM 172.16.5.67/devops/node:20-alpine3.20 AS builder
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN mkdir -p /home/node/aip-knowledge-manage-web && chown -R node:node /home/node/aip-knowledge-manage-web
WORKDIR /home/node/aip-knowledge-manage-web
COPY . /home/node/aip-knowledge-manage-web

RUN npm config set registry  http://172.16.7.4:18081/repository/bobfintech-npm-public/
RUN npm install -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm install
# 金科云桌面环境使用 build:dev
RUN pnpm run build:dev


# 发布阶段
FROM 172.16.5.67/devops/nginx:1.25.2 AS prod
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

EXPOSE 8080
COPY --from=builder /home/node/aip-knowledge-manage-web/dist /usr/share/nginx/html/dist
ENTRYPOINT nginx -g "daemon off;"