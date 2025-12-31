import { Profile } from "@/models/user";
import request from "./request";

// 获取当前工作空间（租户）信息
export const getWorkspaceCurrent = () => {
  return request.get(`/workspaces/current`);
};

// 获取当前用户信息
export const getAccountProfile = () => {
  return request.get<Profile>(`/account/profile`);
};
