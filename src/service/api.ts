import request from './request'

//数据统计页面
//周数据统计
export interface WeeklyData {
    currentDatasetQueries: number
    currentDatasetUsers:number
    currentActiveUsers:number
    currentResources:number
    datasetQueriesGrowthRate:number
    datasetUsersGrowthRate:number
    activeUsersGrowthRate:number
    resourcesGrowthRate:number
}
// //用户分布 目前缺失
// export interface UserDistributionData {
//     categories: string[]
//     values: number[]
// }
//访问趋势
export interface VisitStatsParams {
    startDate?:string
    endDate?:string
}
export interface DailyVisitData {
    date:string
    visitorCount:number
    visitCount:number
}
export interface VisitStatsResponse {
    data:DailyVisitData[]
}

//文档类型饼图
export interface DocumentTypeData {
    type: string
    count: number
    proportion:number
}

//文档调用次数排行榜
export interface DocumentRankingData {
    documentName: string
    creator: string
    callCount: number
}

//对话记录
export interface ConversationLog {
    conversationId: number
    name: string
    userName: string
    mode:string
    createdAt:string
    dialogueCount:number
}

export interface ConversationQueryParams {
    userName?: string
    startTime?: string
    endTime?: string
    pageNum?: number
    pageSize?: number
}

export interface ConversationListResponse {
    records: ConversationLog[]
    total: number
    size: number//每页条数
    current:number//当前页码
    pages: number//总页
}

export interface ConversationMessage {
    content: string
    time: string
    type: 'user' | 'assistant'
}

export interface ConversationDetailResponse {
    data: ConversationMessage[]
}

//登录日志
export interface LoginLog {
    loginId: string
    userName: string
    loginAt: string
    loginMethod: string
    success: boolean
}

export interface LoginQueryParams {
    userName?: string
    loginStartTime?: string
    loginEndTime?: string
    pageNum?: number
    pageSize?: number
}

export interface LoginListResponse {
    records: LoginLog[]
    total: number
    size: number
    current: number
    pages: number
}

//授权记录
export interface AuthLog {
    permissionId: number
    tenantName:string
    datasetId:string
    authorizerName:string
    hasPermission:boolean
    createdAt:string
}

export interface AuthQueryParams {
    authorizationId?: number
    startTime?: string
    endTime?: string
    dataset?: string
    authorizerName?: string
    tenantName?: string
    pageNum?: number
    pageSize?: number
}

export interface AuthListResponse {
    records: AuthLog[]
    total: number
    size: number
    current: number
    pages: number
}

//接口定义
export const apiService = {
    //数据统计
    //周数据
    async getWeeklyData(): Promise<WeeklyData> {
        return request.post('/statistics/weekly-statistics')
    },
    //折线图
    async getTrendData(params: VisitStatsParams): Promise<VisitStatsResponse> {
        return request.post('/statistics/visit-trend', params)
    },
    //饼图
    async getDocumentTypeData(): Promise<DocumentTypeData[]>{
        return request.post('/statistics/document-type-pie')
    },
    //排行榜
    async getDocumentRankingData(): Promise<DocumentRankingData[]>{
        return request.post('/statistics/document-usage-ranking')
    },

    //对话记录
    async getConversationLogs(params: ConversationQueryParams = {}): Promise<ConversationListResponse> {
        return request.post('/statistics/conversation-list', params)
    },
    async getConversationDetail(id: string): Promise<ConversationDetailResponse> {
        return request.post(`/statistics/conversation-list/${id}`)
    },
    //login
    async getLoginLogs(params: LoginQueryParams = {}): Promise<LoginListResponse> {
        return request.post('/statistics/login-log/list', params)
    },
    //auth
    async getAuthLogs(params: AuthQueryParams = {}): Promise<AuthListResponse> {
        return request.post('/statistics/permission-list', params)
    }
}

export default apiService