import request from "./request";

// 获取权限
export const getFolderPermission = () => {
  return request.get<{
    is_admin: boolean
  }>(`/get_folder_permission`);
};
