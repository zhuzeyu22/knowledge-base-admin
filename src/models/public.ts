export type PublicFolder = Omit<PublicFolderNode, "children">;

export type PublicFolderNode = {
  id: string;
  name: string;
  parent_id?: string;
  level: number;
  created_by: string;
  created_at: number;
  updated_at: number;
  children: PublicFolderNode[];
};
