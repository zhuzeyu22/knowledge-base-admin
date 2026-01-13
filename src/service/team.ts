import request from "./request";
import { Member, Team, MemberPermission } from "@/models/team";

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
  return request.post("/app/tenant/add",
    data,
    {
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

//团队知识库成员权限列表
//
export const getTeamMemberPermissionList = (
  dataset_id: string,
  page?: number,
  page_size?: number
) =>
  request.get("/app/user_datasets_role/account_list", {
    params: {
      dataset_id,
      page,
      page_size,
    },
    baseURL: VITE_TENANT_API_BASE_URL,
  });


//修改团队知识库成员权限
//http://172.16.6.129:30720/tenant/api/app/user_datasets_role/batch_modify
export const putTeamMemberPermission = (data: MemberPermission[]) => {
  return request.put(`/app/user_datasets_role/batch_modify`,
    {
      data
    }, {
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

//获取知识库所属目录
//http://127.0.0.1:5001/console/api/get_dataset_folder?dataset_id=80ec29a5-b145-4dc8-87dd-f86480774d2e
export const getDatasetFolder = (dataset_id: string) =>
  request.get(`/get_dataset_folder?dataset_id=${dataset_id}`, {
    params: {
      dataset_id,
    }
  });

//公开团队知识库
//http://127.0.0.1:5001/console/api/add_public_dataset
export const postKnowledgePublic = (
  team: string,
  folder_ids: string[],
  dataset_id: string,
  folder_names:string[],
  dataset_name:string
) => {
  return request.post("/add_public_dataset", {
    team,
    folder_ids,//公开到哪些目录
    dataset_id,
    folder_names,
    dataset_name
  })
}

//取消公开知识库
//http://127.0.0.1:5001/console/api/cancel_public_dataset
export const putCancelKnowledgePublic = (
  folder_ids: string[],
  dataset_id: string,
  folder_names:string[],
  dataset_name:string
) =>
  request.put("/cancel_public_dataset", {
    folder_ids,
    dataset_id,
    folder_names,
    dataset_name
  })


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

// 增加团队成员
// http://172.16.6.129:30720/tenant/api/app/user_tenant_role/add
export const postUser = (tenant_id: string, users: {
  user: string,
  name: string,
}[]) => {
  return request.post("/app/user_tenant_role/add", {
    tenant_id,
    users
  }, {
    baseURL: VITE_TENANT_API_BASE_URL,
  }
  );
}

//
// curl --request PUT \
//   --url http://172.16.6.129:30720/tenant/api/app/tenant/modify/4e7290bd-f4b6-4ec0-ab41-c2e2d716a8bd \
//   --header 'Accept: */*' \
//   --header 'Accept-Encoding: gzip, deflate, br' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWIyOTg0ZDMtNjM3MS00OGI1LWJiY2YtYWFhOGUyNDY4YzA2IiwiZXhwIjoxNzY3OTMwMzM5LCJpc3MiOiJTRUxGX0hPU1RFRCIsInN1YiI6IkNvbnNvbGUgQVBJIFBhc3Nwb3J0In0.7W05YOJSLf6Jr6cVw6NJLpy8xYvQzVpDkRGxynhysn4' \
//   --header 'Connection: keep-alive' \
//   --header 'Content-Type: application/json' \
//   --header 'User-Agent: PostmanRuntime-ApipostRuntime/1.1.0' \
//   --data '{
//     "name":"测试修改名字"
// }'
// 修改团队名称
//http://172.16.6.129:30720/tenant/api/app/tenant/modify/4e7290bd-f4b6-4ec0-ab41-c2e2d716a8bd
export const putTeamNameModify = (tenantId: string, name: string) => {
  return request.put(`/app/tenant/modify/${tenantId}`,
    {
      name
    }, {
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 当前团队信息
// /tenant/api/app/user_tenant_role/role?tenant_id=8219d257-e383-441f-9c0f-07625e2c67e3&account_id=71aaf60f-544b-4478-ae57-612814946eb1
export const getTeamInfo = (tenant_id: string) => {
  return request.get(`/app/tenant/info/${tenant_id}`, {
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 删除团队
// /tenant/api/app/tenant/delete/145160f4-ad15-4054-bcb0-cd01daadf2a5 \
export const deleteTeam = (tenant_id: string) => {
  return request.delete(`/app/tenant/delete/${tenant_id}`, {
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

// 查询当前用户在团队中的权限
// /tenant/api/app/user_tenant_role/tenant_permission 
export const getTeamPermission = (account_id: string, tenant_id: string) => {
  return request.get(`/app/user_tenant_role/tenant_permission`, {
    params: {
      tenant_id,
      account_id,
    },
    baseURL: VITE_TENANT_API_BASE_URL,
  });
};

