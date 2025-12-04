import request from "./request";

// https://www.finna.com.cn/console/api/workspaces/current
export const getWorkspaceCurrent = () => {
  return request.get(`/workspaces/current`);
};
