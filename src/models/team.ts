// tenant
export type Team = {
  avatar: string;
  description: string;
  // 个人空间还是团队空间
  is_public: boolean;
  name: string;
  owner: string;
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
