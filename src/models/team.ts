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
