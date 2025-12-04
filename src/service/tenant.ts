import request from "./request";

export const getTokenList = (HTTP_USER_INFO: string) => {
  return request.post(
    "/app/account/sso_login",
    { HTTP_USER_INFO },
    {
      baseURL: "/tenant/api",
    }
  );
};

// role_permission/name_list?role_id=
// 获取角色权限名称列表
export   const getRolePermissionNameList = (role_id: string) => {
  return request.get(`/role_permission/name_list?role_id=${role_id}`, {
    baseURL: "/tenant/api",
  });
};

// tenant/api/app/role/list
// 获取角色列表
export const getRoleList = () => {
  return request.get("/app/role/list", {
    baseURL: "/tenant/api",
  });
};