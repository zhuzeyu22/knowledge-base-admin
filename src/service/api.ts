import request from './request'

//对话记录接口
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
}

export interface ConversationListResponse {
    data: ConversationLog[]
    total: number
}

//登录日志
export interface LoginLog {
    id:number
    user:string
    type:string
    date:string
    operation:string
}

export interface LoginQueryParams {
    user?:string
    startDate?:string
    endDate?:string
}

export interface LoginListResponse {
    data:LoginLog[]
    total:number
}

//授权记录
export interface AuthLog {
    id:number
    authorizationId:number
    authorizedUser:string
    dataset:string
    datasetId:number
    authorizor:string
    type:string
    date:string
}

export interface AuthQueryParams {
    authorizationId?:number
    startDate?:string
    endDate?:string
    dataset?:string
    authorizer?:string
    authorizedUser?:string
}

export interface AuthListResponse {
    data:AuthLog[]
    total:number
}

//接口定义
export const apiService = {
    //对话记录
    async getConversationLogs(params: ConversationQueryParams = {}): Promise<ConversationListResponse> {
        return request.get('api/conversation-logs', { params })
    },
    async getConversationDetail(id:number):Promise<ConversationLog>{
        return request.get(`api/conversation-logs/${id}`)
    },
    //login
    async getLoginLogs(params:LoginQueryParams = {}):Promise<LoginListResponse> {
        return request.get('api/login-logs', { params })
    },
    //auth
    async getAuthLogs(params:AuthQueryParams = {}):Promise<AuthListResponse>{
        return request.get('api/auth-logs',{ params})
    },
    async getAuthDetaim(id:number):Promise<AuthLog>{
        return request.get(`api/auth-logs/${id}`)
    }
}

export default apiService