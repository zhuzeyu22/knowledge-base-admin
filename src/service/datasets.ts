import request from "./request";

// 下面的这些参数后续具体再对下
type CreateDocumentReq = {
  [key in string]: any;
};
type IndexingEstimateParams = {
  [key in string]: any;
};

// finna 原本的 dataset list ， 不用这个
// 使用新的 getKnowledgeBaseList
// export const fetchDatasetList = () => {
//   return request.get("/datasets");
// };

export const createDocument = (datasetId: string, body: CreateDocumentReq) => {
  return request.post(`/datasets/${datasetId}/documents`, body);
};

export const createFirstDocument = (body: CreateDocumentReq) => {
  return request.post(`/datasets/init`, body);
};

export const fetchDefaultProcessRule = (url: string) => {
  return request.get(url);
};

export const fetchFileIndexingEstimate = (body: IndexingEstimateParams) => {
  return request.post(`/datasets/indexing-estimate`, body);
};

// 共享空间查询
export const getKnowledgeBaseList = ({
  include_all = false,
  page = 1,
  limit = 30,
}: {
  include_all: boolean;
  page: number;
  limit: number;
}) => {
  return request.get("/datasets/share", {
    params: { page, limit, include_all },
  });
};

export type KnowledgeBase = {
  [key in string]: any;
};

// 更新知识库
export const updateKnowledgeBase = (id: string, data: KnowledgeBase) => {
  return request.patch(`/datasets/${id}`, data);
};

export type UploadResponse = {
  created_at: number;
  created_by: string;
  extension: string;
  id: string;
  mime_type: string;
  name: string;
  size: number;
};

// 上传文档
export const uploadDocument = (data: FormData) => {
  return request.postForm(`/files/upload?source=datasets`, data);
};
