import request from "./request";
import { Member, Team } from "@/models/team";

const VITE_TENANT_API_BASE_URL = import.meta.env.VITE_TENANT_API_BASE_URL;

type TenantListResponse = {
  data: {
    results: Team[];
    count: number;
  };
  message: string;
  status: "success" | string;
};

// 对应 finna 工作空间（租户）
// https://www.finna.com.cn/tenant/api/app/user_tenant_role/tenant_list?account_id=71aaf60f-544b-4478-ae57-612814946eb1&page=1&page_size=100
export const getTenantList = (
  account_id: string,
  page: number,
  page_size: number
) =>
  request.get<TenantListResponse>("/app/user_tenant_role/tenant_list", {
    params: {
      account_id,
      page,
      page_size,
    },
    baseURL: VITE_TENANT_API_BASE_URL,
  });

// https://www.finna.com.cn/console/api/datasets?page=1&limit=30&include_all=false
export const getDatasetList = (
  tenant_id: string,
  page: number,
  limit: number
) =>
  request.get("/app/dataset/list", {
    params: {
      tenant_id,
      page,
      limit,
    },
    baseURL: VITE_TENANT_API_BASE_URL,
  });

// 创建团队
// https://www.finna.com.cn/tenant/api/app/tenant/add post
// avatar :"it is mock"
// description :"bigood"
// is_public :true
// name :"bigood"
// owner :"f5a3c6c5-5670-46c8-bbf0-d95741a16c2a"
export const postAddTenant = (data: Partial<Team>) => {
  return request.post("/app/tenant/add", {
    data,
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

//  http://172.16.6.129:30720/tenant/api/app/tenant/delete/145160f4-ad15-4054-bcb0-cd01daadf2a5\
export const deleteTenant = (tenant_id: string) => {
  return request.delete(`/app/tenant/delete/${tenant_id}`, {
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 团队角色列表
// https://www.finna.com.cn/tenant/api/app/role/list
export const getRoleList = () => {
  return request.get("/app/role/list", {
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 团队成员列表
// https://www.finna.com.cn/tenant/api/app/user_tenant_role/account_list?page=1&page_size=-1&tenant_id=8219d257-e383-441f-9c0f-07625e2c67e3
export const getTeamMemberList = (
  tenant_id: string,
  page: number,
  page_size: number
) =>
  request.get("/app/user_tenant_role/account_list", {
    params: {
      tenant_id,
      page,
      page_size,
    },
    baseURL: VITE_TENANT_API_BASE_URL,
  });

//当前用户角色
// /tenant/api/app/user_tenant_role/role?tenant_id=8219d257-e383-441f-9c0f-07625e2c67e3&account_id=71aaf60f-544b-4478-ae57-612814946eb1
export const getUserRole = (tenant_id: string, account_id: string) => {
  return request.get("/app/user_tenant_role/role", {
    params: {
      tenant_id,
      account_id,
    },
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 修改团队成员角色
// /tenant/api/app/user_tenant_role/modify/aeb6d00e-a098-4a02-8fc8-689af3ba7102
export const putUserRole = (data: Member) => {
  return request.put(`/app/user_tenant_role/modify/${data.id}`, data, {
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 删除团队成员
// https://www.finna.com.cn/tenant/api/app/user_tenant_role/delete/a4b7e290-34bb-4981-88fc-e69a2aef5059
export const deleteUser = (data: Member) => {
  return request.delete(`/app/user_tenant_role/delete/${data.id}`, {
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 切换团队空间
// https://www.finna.com.cn/console/api/workspaces/switch
export const postSwitchWorkspace = (tenant_id: string) => {
  return request.post("/workspaces/switch", {
    tenant_id,
  });
};
