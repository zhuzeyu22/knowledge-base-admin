import request from '../request'
import { Dataset } from '@/models/dataset';

//调用文档列表
export interface DocumentList {
    id?: string | number;
    datasetId: string;
    name: string;
    segmentMode: string;
    word_count: number;
    hit_count:number;
    created_at: string;
    enabled: boolean;
}
export interface DocumentListParams {
    keyword?: string
    
}
export interface DocumentListResponse {
    data:DocumentList[]
}

export const apiService = {
    // 根据ID获取单个数据集详情
    async getDatasetById(datasetId: string): Promise<Dataset> {
        return request.get(`datasets/${datasetId}`)
    },
    
    // 获取文档列表
    async getDocumentList(datasetId: string, params: DocumentListParams = {}): Promise<DocumentListResponse> {
        return request.get(`datasets/${datasetId}/documents`, {
            params: params
        })
    }
}

export default apiService