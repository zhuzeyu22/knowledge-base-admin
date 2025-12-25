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
// 获取某个工作空间下某个用户的角色
export const getTenantRole = (tenant_id: string, account_id: string) => {
  return request.get("/app/user_tenant_role/role", {
    params: { tenant_id, account_id },
    baseURL: "/tenant/api",
  });
};
// 根据角色查询对应的权限
export const getRolePermissionNameList = (role_id: string) => {
  return request.get("/app/role_permission/name_list", {
    params: { role_id },
    baseURL: "/tenant/api",
  });
};