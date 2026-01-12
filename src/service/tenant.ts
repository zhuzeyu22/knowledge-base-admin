import request from "./request";

const VITE_TENANT_API_BASE_URL = import.meta.env.VITE_TENANT_API_BASE_URL;

export const getTokenList = (HTTP_USER_INFO: string) => {
  return request.post(
    "/app/account/sso_login",
    { HTTP_USER_INFO },
    {
      baseURL: VITE_TENANT_API_BASE_URL,
    }
  );
};
// 获取某个工作空间下某个用户的角色
export const getTenantRole = (tenant_id: string, account_id: string) => {
  return request.get("/app/user_tenant_role/role", {
    params: { tenant_id, account_id },
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};
// 根据角色查询对应的权限
export const getRolePermissionNameList = (role_id: string) => {
  return request.get("/app/role_permission/name_list", {
    params: { role_id },
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 1.	在团队新建知识库之后，需要将团队中的人员权限批量添加到新建知识库中。
// 接口：http://172.16.6.129:30720/tenant/api/app/user_datasets_role/batch_add

export const postUserDatasetsRolBatchAdd = (tenant_id: string, dataset_id: string) => {
  return request.post(
    "/app/user_datasets_role/batch_add",
    {
      tenant_id,
      dataset_id
    },
    {
      baseURL: VITE_TENANT_API_BASE_URL,
    }
  );
};