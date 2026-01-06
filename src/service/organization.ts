import request from "./request";

// 获取当前工作空间（租户）信息
export const getWorkspaceCurrent = () => {
  return request.get(`/workspaces/current`);
};


// 获取组织结构
// organization/tree
export const getOrganizationTree = () => {
  return request.get(`/organization/tree`);
};