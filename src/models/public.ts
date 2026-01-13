export type PublicFolder = Omit<PublicFolderNode, "children">;

export type PublicFolderNode = {
  id?: string | null;
  name: string;
  parent_id?: string | null;
  level: number;
  created_by?: string;
  created_at?: number;
  updated_at?: number;
  children: PublicFolderNode[];
};
// 公开知识库目录数据结构
export type PublicTree = {
  id:string,
  name: string,
  parent_id: string,
  path: string,
  children: PublicTree[]
}