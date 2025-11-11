import request from "./request";

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

// 获取分段列表
export const getSegmentList = (
  datasetId: string,
  documentId: string,
  page: number,
  limit: number,
  keyword: string = "",
  enabled: string = "all"
) => {
  return request.get(
    `/datasets/${datasetId}/documents/${documentId}/segments?page=${page}&limit=${limit}&keyword=${keyword}&enabled=${enabled}`
  );
};

// https://www.finna.com.cn/console/api/datasets/4fe11447-421e-4bda-a7c9-d86b1d47e41f/documents/df7f81c1-2f8f-47e7-ada2-69c8a66961d8/segments?page=1&limit=10&keyword=&enabled=all

// 删除分段
export const deleteSegment = (
  datasetId: string,
  documentId: string,
  segmentId: string
) => {
  return request.delete(
    `/datasets/${datasetId}/documents/${documentId}/segments?segment_id=${segmentId}`
  );
};

// https://www.finna.com.cn/console/api/datasets/4fe11447-421e-4bda-a7c9-d86b1d47e41f/documents/df7f81c1-2f8f-47e7-ada2-69c8a66961d8/segments?segment_id=58b3341a-d05e-48f9-9c33-c8a98911ae26

// 新增分段
export const createSegment = (
  datasetId: string,
  documentId: string,
  content: string,
  keywords: string[]
) => {
  return request.post(
    `/datasets/${datasetId}/documents/${documentId}/segment`,
    { content, keywords }
  );
};
// https://www.finna.com.cn/console/api/datasets/4fe11447-421e-4bda-a7c9-d86b1d47e41f/documents/56b39d78-d5ae-47c0-ac6b-4ca4ec3005f7/segment

// 编辑分段

export const patchSegment = (
  datasetId: string,
  documentId: string,
  segmentId: string,
  content: string,
  keywords: string[]
) => {
  return request.patch(
    `/datasets/${datasetId}/documents/${documentId}/segments/${segmentId}`,
    { content, keywords }
  );
};

// https://www.finna.com.cn/console/api/datasets/4fe11447-421e-4bda-a7c9-d86b1d47e41f/documents/56b39d78-d5ae-47c0-ac6b-4ca4ec3005f7/segments/56e6e0a2-8ea1-4ef4-8342-ce7af730316f

//修改分段状态

export const patchSegementStatus = (
  // datasetId: string,
  // status: boolean,
  // segmentId: string
) => {
  
}