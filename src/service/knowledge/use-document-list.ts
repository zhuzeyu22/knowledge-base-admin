import request from '../request'

//调用文档列表
export interface DocumentList {
    id?: string | number;
    datasetId: string;
    name: string;
    segmentMode: string;
    // charCount: string;
    word_count: number;
    // recallCount: number;
    hit_count:number;
    //uploadTime: string;
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
    // 获取文档列表
    async getDocumentList(datasetId: string, params: DocumentListParams = {}): Promise<DocumentListResponse> {
        return request.get(`datasets/${datasetId}/documents`, {
            params: params
        })
    }
}

export default apiService