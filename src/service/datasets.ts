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


// 上传插件
export const uploadPlugin = (data: FormData) => {
  return request.postForm(`/workspaces/current/plugin/upload/pkg`, data);
};

// 安装插件
export const installPlugin = (data: any) => {
  return request.post(`/workspaces/current/plugin/install/pkg`, data);
};



// 创建知识库
export const initDataset = (body: {
  data_source: {
    type: string;
    info_list: {
      data_source_type: string;
      file_info_list: {
        file_ids: string[];
      };
    };
  };
  doc_form: string;
  doc_language: string;
  embedding_model: string;
  embedding_model_provider: string;
  indexing_technique: string;
  process_rule: {
    mode: string;
    rules:
      | {
          segmentation: {
            separator: string;
            max_tokens: number;
            chunk_overlap: number;
          };
          pre_processing_rules: {
            id: string;
            enabled: boolean;
          }[];
        }
      | {
          parent_mode: string;
          pre_processing_rules: {
            id: string;
            enabled: boolean;
          }[];
          segmentation: {
            separator: string;
            max_tokens: number;
          };
          subchunk_segmentation: {
            separator: string;
            max_tokens: number;
          };
        };
  };
  retrieval_model: any;
  official: string;
}) => {
  return request.post(`/datasets/init`, body);
};

// 查询个人知识库列表
export const getPrivateDatasetList = (page: number, limit: number) => {
  return request.get(`/datasets?page=${page}&limit=${limit}&include_all=false`);
};

// 查询共享知识库列表
export const getPublicDatasetList = ({
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

// 文件预览
export const getFilesPreview = (id: string) => {
  return request.get(`/files/${id}/preview`);
};
