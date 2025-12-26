export type PublicFolderNode = {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  children: PublicFolderNode[];
};
