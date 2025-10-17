import request from './request'

//数据统计
export interface StatCardData {
    title: string
    value: string | number
    icon: string,
    iconClass: string,
    trend: number
}

export interface ChartData {
    name: string
    value: number
}

export interface UserDistributionData {
    categories: string[]
    values: number[]
}

export interface TrendData {
    dates: string[]
    visitCount: number[]
    visitorCount: number[]
}

export interface DocumentTypeData {
    value: number
    name: string
}

export interface TopDocument {
    name: string
    dept: string
    calls: number
    tokens: string
}

export interface StatDataResponse {
    cardData: StatCardData[]
    userDistribution: UserDistributionData
    documentTypes: DocumentTypeData[]
    topDocuments: TopDocument[]
}

export interface TrendQueryParams {
    startDate?: string
    endDate?: string
}
//对话记录
export interface ConversationLog {
    id: number
    log: string
    user: string
    dataset: string
    date: string
    rounds: number
}

export interface ConversationQueryParams {
    log?: string
    user?: string
    startDate?: string
    endDate?: string
    page?: number
    pageSize?: number
}

export interface ConversationListResponse {
    data: ConversationLog[]
    total: number
}

//登录日志
export interface LoginLog {
    id: number
    user: string
    type: string
    date: string
    operation: string
}

export interface LoginQueryParams {
    user?: string
    startDate?: string
    endDate?: string
}

export interface LoginListResponse {
    data: LoginLog[]
    total: number
}

//授权记录
export interface AuthLog {
    id: number
    authorizationId: number
    authorizedUser: string
    dataset: string
    datasetId: number
    authorizor: string
    type: string
    date: string
}

export interface AuthQueryParams {
    authorizationId?: number
    startDate?: string
    endDate?: string
    dataset?: string
    authorizer?: string
    authorizedUser?: string
}

export interface AuthListResponse {
    data: AuthLog[]
    total: number
}

//接口定义
export const apiService = {
    //数据统计
    async getStatData(): Promise<StatDataResponse> {
        return request.get('api/stat/data')
    },
    async getTrendData(params: TrendQueryParams = {}): Promise<TrendData> {
        return request.get('api/stat/trend', { params })
    },
    //对话记录
    async getConversationLogs(params: ConversationQueryParams = {}): Promise<ConversationListResponse> {
        return request.get('api/conversation-logs', { params })
    },
    async getConversationDetail(id: number): Promise<ConversationLog> {
        return request.get(`api/conversation-logs/${id}`)
    },
    //login
    async getLoginLogs(params: LoginQueryParams = {}): Promise<LoginListResponse> {
        return request.get('api/login-logs', { params })
    },
    //auth
    async getAuthLogs(params: AuthQueryParams = {}): Promise<AuthListResponse> {
        return request.get('api/auth-logs', { params })
    },
    async getAuthDetaim(id: number): Promise<AuthLog> {
        return request.get(`api/auth-logs/${id}`)
    }
}

export default apiService