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

export type TeamNode = {
  id: string;
  name: string;
  member: Member[];
} & Team;

export type Member = {
  id: string;
  name: string;
  role: string;
  roleId: string;
};

export type Role = {
  id: string;
  name: "开发" | string;
  created_at?: string;
  description?: string;
  status?: true;
  updated_at?: string;
};
