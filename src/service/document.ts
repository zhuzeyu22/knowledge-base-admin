import { Document } from "@/models/document";
import request from "./request";

// 查询文档详细信息
export const getDocumentDetail = (
  datasetId: string,
  documentId: string,
  page: number,
  limit: number,
  keyword: string,
  enabled: boolean
) => {
  return request.get(
    `/datasets/${datasetId}/documents/${documentId}/?page=${page}&limit=${limit}&keyword=${keyword}&enabled=${enabled}`
  );
};

// 更新文档状态
export const patchDocumentStatus = (
  datasetId: string,
  status: boolean,
  documentId: string
) => {
  return request.patch(
    `/datasets/${datasetId}/documents/status/${
      status ? "enable" : "disable"
    }/batch?document_id=${documentId}`
  );
};

// 文档重命名
export const postDocumentRename = (
  datasetId: string,
  documentId: string,
  name: string
) => {
  return request.post(`/datasets/${datasetId}/documents/${documentId}/rename`, {
    name,
  });
};
// https://www.finna.com.cn/console/api/datasets/4fe11447-421e-4bda-a7c9-d86b1d47e41f/documents/420c5dde-23cc-4e6e-bb2f-f16765e1743c/rename

// 删除文档
export const deleteDocument = (datasetId: string, documentId: string) => {
  return request.delete(
    `/datasets/${datasetId}/documents/${documentId}`
  );
};
// https://www.finna.com.cn/console/api/datasets/4fe11447-421e-4bda-a7c9-d86b1d47e41f/documents?document_id=420c5dde-23cc-4e6e-bb2f-f16765e1743c

// 获取知识库里面文档对应的配置信息
export const getDocumentMetaData = (datasetId: string, documentId: string) => {
  return request.get(
    `/datasets/${datasetId}/documents/${documentId}?metadata=without`
  );
};
// https://www.finna.com.cn/console/api/datasets/94e8a77b-0018-4e00-9671-972ec0f4896e/documents/e4f4027a-06a4-46e8-b8b0-6c7777aa7c88?metadata=without


// 更新文档配置

export const postDocumentSettings = (
  datasetId: string,
  data: Exclude<Document, "id">
) => {
  return request.post(`/datasets/${datasetId}/documents`, data);
};

// https://www.finna.com.cn/console/api/datasets/94e8a77b-0018-4e00-9671-972ec0f4896e/documents
