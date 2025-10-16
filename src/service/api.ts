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

//接口定义
export const apiService = {
    //对话记录
    async getConversationLogs(params: ConversationQueryParams = {}): Promise<ConversationListResponse> {
        return request.get('api/', { params })
    },
    //login
    async getLoginLogs(params:LoginQueryParams = {}):Promise<LoginListResponse> {
        return request.get('api/', { params })
    },
}

export default apiService