// 知识库-文档 数据结构
export type OrganizationNode = {
  // 人员 id
  id?: string | null;
  // 名称
  name: string;
  type: "department" | "user";
  // 组织 id
  org_id?: string | null;
  // org_id 为准
  parent_id: string | null;
  has_children: boolean;
  children: OrganizationNode[];
};
