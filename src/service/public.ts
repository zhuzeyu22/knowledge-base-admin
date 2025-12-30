import { PublicFolder } from "@/models/public";
import request from "./request";
import { Dataset } from "@/models/dataset";

export type FolderOptResponse = {
  code: string;
  message: string;
  status: number;
  // id?: string;
  folder_id?: string;
};

// 创建公共知识库目录文件夹
// level 从 0 开始，0 表示 root 下的一级目录
export const postCreateFolder = (
  name: string,
  level: string | number,
  parent_id: string | null = null
) => {
  return request.post<Required<FolderOptResponse>>("/create_folder", {
    name,
    parent_id,
    level,
  });
};

// 删除公共知识库目录文件夹
export const deleteFolder = (id: string) => {
  return request.delete<FolderOptResponse>(`/delete_folder/${id}`);
};

//重命名公共知识库目录文件夹
export const renameFolder = (id: string, name: string) => {
  return request.post<FolderOptResponse>(`/update_folder`, { id, name });
};

// 查询公共知识库目录文件夹下的数据
export const getFolder = (parent_id: string = "") => {
  return request.get<{
    data: PublicFolder[];
    message: string;
  }>(`/get_folder?parent_id=${parent_id}`);
};

// 查询文件夹中的知识库列表
// todo 暂不考虑分页，下一版本优化
export const getDatasetsByFolderId = (id: string = "") => {
  return request.get<{
    data: Dataset[];
  }>(`/folder_datasets/folder_id=${id}`);
};
