// tenant
export type Team = {
  avatar: string;
  description: string;
  // 个人空间还是团队空间
  is_public: true | boolean;
  name: string;
  owner: string;
  tenant_id: string;
};

export type Member = {
  account_id: string;
  account_name: string;
  // id 是更新数据用
  id: string;
  role_id: string;
  role_name: string;
  tenant_id: string;
};

export type Role = {
  id: string;
  name: "开发" | string;
  created_at?: string;
  description?: string;
  status?: true;
  updated_at?: string;
};

export type MemberPermission = {
  role_name: string;//当前权限名称
  role_id?: string;
  role?: string;
  id?: string;//表格一行数据id
  account_name?: string;
  account_avatar?:string;
  account_id?:string;
  dataset_id?:string;
  meta_info?:string;
  created_at?:string;
}
