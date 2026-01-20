import { RetrievalModel } from "@/models/dataset";
import request from "./request";
import router from "@/router";

// 下面的这些参数后续具体再对下
type CreateDocumentReq = {
  [key in string]: any;
};

//分段设置的传的body数据类型
type PreProcessingRule = {
  id: string;
  enabled: boolean;
};
type Segmentation = {
  separator: string;
  max_tokens: number;
  chunk_overlap: number;
};
type Rules = {
  pre_processing_rules: PreProcessingRule[];
  segmentation: Segmentation;
};
type ProcessRule = {
  mode: string;
  rules: Rules;
};
type FileInfoList = {
  file_ids: string[];
};
type InfoList = {
  data_source_type: string;
  file_info_list: FileInfoList;
};
export type IndexingEstimateParams = {
  doc_form: string;
  doc_language: string;
  indexing_technique: string;
  info_list: InfoList;
  process_rule: ProcessRule;
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

  // 团队知识库 trick surprise 
  const tenantId = router.currentRoute.value.params.teamId
  if (tenantId) {
    console.log('initDataset tenantId', tenantId)
    body.tenantId = tenantId
  }
  return request.post(`/datasets/init`, body);
};

// 查询个人知识库列表
export const getPrivateDatasetList = (
  page: number,
  limit: number,
  keyword: string = ""
) => {
  return request.get(
    `/datasets?page=${page}&limit=${limit}&include_all=false&keyword=${keyword || ""
    }`
  );
};

// 查询共享知识库列表
export const getPublicDatasetList = (
  page: number = 1,
  limit: number = 30,
  include_all: boolean = false
) => {
  return request.get("/datasets", {
    params: { page, limit, include_all },
  });
};

// 文件预览
export const getFilesPreview = (id: string) => {
  return request.get(`/files/${id}/preview`);
};

export type DatasetHitTesting = {
  query: string;
  retrieval_model: RetrievalModel;
};

// 召回测试
export const postDatasetHitTesting = (
  datasetId: string,
  data: DatasetHitTesting
) => {
  return request.post(`/datasets/${datasetId}/hit-testing`, data);
};

// 召回测试记录
export const getDatasetHitTestingRecords = (
  datasetId: string,
  limit: number,
  page: number
) => {
  return request.get(
    `/datasets/${datasetId}/queries?limit=${limit}&page=${page}`
  );
};

// 文档状态查询
export const getIndexingStatus = (datasetId: string, batchId: string) => {
  return request.get(`/datasets/${datasetId}/batch/${batchId}/indexing-status`);
};

// 测试页面
// export const getDatasetSettings = (
//   datasetId: string,
//   introduction: string,
// ) => {
//   const rsc =
//   return request.get{
//     `/datasets/${datasetId}/settings?_rsc=${rsc}`
//   }
// }

//获取embedding模型列表
export const getEmbeddingList = () => {
  return request.get(`/workspaces/current/models/model-types/text-embedding`);
};
//获取rerank模型列表
export const getRerankList = () => {
  return request.get(`/workspaces/current/models/model-types/rerank`);
};

// 删除知识库
export const deleteDataset = (datasetId: string) => {
  return request.delete(`/datasets/${datasetId}`);
};
// https://www.finna.com.cn/console/api/datasets/c808edbf-c7bf-4f0b-a10c-9beeafa83108

// 获取知识库配置
// /apps/datasets/0943d6f6-f906-4041-9359-6c6dabf75261/settings
export const getDatasetProcessRule = (datasetId: string) => {
  return request.get(`/datasets/process-rule`);
}



