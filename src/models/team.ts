export type TeamNode = {
  id: string;
  name: string;
  member: Member[];
};

export type Member = {
  id: string;
  name: string;
  role: string;
  roleId: string;
};
