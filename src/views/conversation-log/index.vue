<template>
    <div class="conversation-log-page">
        <el-container class="container">
            <!-- 标题 -->
            <el-header class="page-header page-style">
                <h2 class="page-title">对话记录</h2>
            </el-header>
            <!-- 下方表格 -->
            <el-main class="page-main page-style">
                <!-- 查询模块表格 -->
                <div class="query-table">
                    <el-form :inline="true" :model="formInline">
                        <el-form-item label="用户标识">
                            <el-input class="input" v-model="formInline.user" clearable />
                        </el-form-item>
                        <el-form-item label="时间范围">
                            <el-date-picker class="input" v-model="formInline.date" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" clearable />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onQuery" :loading="queryLoading">查询</el-button>
                            <el-button @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 对话记录表单 -->
                <div class="log-table">
                    <el-table class="table" :data="logList" style="width: 100%" :border="false" >
                        <el-table-column type="index" label="序号" min-width="100" />
                        <el-table-column prop="userName" label="用户标识" min-width="130" />
                        <el-table-column prop="name" label="会话名称" min-width="130" />
                        <el-table-column prop="createdAt" label="开始时间" min-width="130" />
                        <el-table-column prop="dialogueCount" label="对话轮数" min-width="100" />
                        <el-table-column label="操作" min-width="100">
                            <template #default="scope">
                                <el-button link type="primary" @click="onDetail(scope.row)">
                                    查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页 -->
                <div class="pagination-block">
                    <el-pagination 
                        :v-model:current-page="currentPage" 
                        :v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]"
                        :background="true"
                        layout="sizes, prev, pager, next" 
                        :total="total"
                        @size-change="handleSizeChange" 
                        @current-change="handleCurrentChange"
                        prev-text="< 上一页"
                        next-text="下一页 >" />
                </div>
                <!-- 详情抽屉 -->
                <transition name="overlay-fade">
                    <div class="custom-drawer-overlay" v-if="drawerVisible" @click="drawerVisible = false"></div>
                </transition>
                <transition name="drawer-slide">
                    <div class="custom-drawer" v-if="drawerVisible">
                        <div class="drawer-header">
                            <div class="header-content">
                                <h3>对话记录</h3>
                                <p class="session-info">用户: {{ currentSession.userName }} | 会话: {{ currentSession.name }}</p>
                            </div>
                            <el-icon class="close-icon" @click="drawerVisible = false">
                                <Close/>
                            </el-icon>
                        </div>
                        <div class="drawer-body">
                            <div class="conversation-content">
                                <div 
                                    v-for="(message, index) in conversationMessages" 
                                    :key="index"
                                    :class="['message-item', message.type === 'user' ? 'message-right' : 'message-left']"
                                >
                                    <div class="message-bubble">
                                        <div class="message-text">{{ message.content }}</div>
                                    </div>
                                    <div v-if="message.type === 'assistant'" class="message-meta">
                                        <span class="time">{{ message.time }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </el-main>
        </el-container>

    </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import apiService, { ConversationQueryParams, ConversationMessage } from '../../service/api'

const formInline = reactive({
    user: '',
    date: [],
})


//模拟数据
const getMockData = [
    { conversationId: 1, log: 'log001', name: '法律知识库对话', userName: 'user001', mode: 'chat', createdAt: '2024-12-01 09:30', dialogueCount: 3 },
    { conversationId: 2, log: 'log002', name: 'Agent系统咨询', userName: 'user002', mode: 'chat', createdAt: '2024-12-02 14:15', dialogueCount: 5 },
    { conversationId: 3, log: 'log003', name: '大模型对话', userName: 'user001', mode: 'chat', createdAt: '2024-12-03 16:45', dialogueCount: 2 },
    { conversationId: 4, log: 'log004', name: '技术知识库咨询', userName: 'user003', mode: 'chat', createdAt: '2024-12-04 10:20', dialogueCount: 7 },
    { conversationId: 5, log: 'log005', name: '医疗知识库', userName: 'user002', mode: 'chat', createdAt: '2024-12-05 13:10', dialogueCount: 4 },
    { conversationId: 6, log: 'log006', name: 'Agent系统对话', userName: 'user004', mode: 'chat', createdAt: '2024-12-06 15:30', dialogueCount: 6 },
    { conversationId: 7, log: 'log007', name: '大模型咨询', userName: 'user005', mode: 'chat', createdAt: '2024-12-07 10:00', dialogueCount: 8 },
    { conversationId: 8, log: 'log008', name: '法律知识库', userName: 'user006', mode: 'chat', createdAt: '2024-12-08 11:20', dialogueCount: 3 },
    { conversationId: 9, log: 'log009', name: '医疗知识库咨询', userName: 'user007', mode: 'chat', createdAt: '2024-12-09 13:45', dialogueCount: 5 },
    { conversationId: 10, log: 'log010', name: 'Agent系统', userName: 'user008', mode: 'chat', createdAt: '2024-12-10 15:30', dialogueCount: 4 },
    { conversationId: 11, log: 'log011', name: '教育知识库对话', userName: 'user009', mode: 'chat', createdAt: '2024-12-11 09:15', dialogueCount: 6 },
    { conversationId: 12, log: 'log012', name: '大模型对话', userName: 'user010', mode: 'chat', createdAt: '2024-12-12 10:40', dialogueCount: 7 },
    { conversationId: 13, log: 'log013', name: '法律知识库咨询', userName: 'user001', mode: 'chat', createdAt: '2024-12-13 14:20', dialogueCount: 2 },
    { conversationId: 14, log: 'log014', name: 'Agent系统对话', userName: 'user002', mode: 'chat', createdAt: '2024-12-14 16:00', dialogueCount: 5 },
    { conversationId: 15, log: 'log015', name: '技术知识库', userName: 'user003', mode: 'chat', createdAt: '2024-12-15 09:50', dialogueCount: 8 },
    { conversationId: 16, log: 'log016', name: '大模型咨询', userName: 'user004', mode: 'chat', createdAt: '2024-12-16 11:30', dialogueCount: 3 },
    { conversationId: 17, log: 'log017', name: '金融知识库对话', userName: 'user005', mode: 'chat', createdAt: '2024-12-17 13:10', dialogueCount: 6 },
    { conversationId: 18, log: 'log018', name: 'Agent系统咨询', userName: 'user006', mode: 'chat', createdAt: '2024-12-18 15:45', dialogueCount: 4 },
    { conversationId: 19, log: 'log019', name: '医疗知识库对话', userName: 'user007', mode: 'chat', createdAt: '2024-12-19 10:25', dialogueCount: 7 },
    { conversationId: 20, log: 'log020', name: '大模型对话', userName: 'user008', mode: 'chat', createdAt: '2024-12-20 12:00', dialogueCount: 5 },
    { conversationId: 21, log: 'log021', name: '教育知识库咨询', userName: 'user009', mode: 'chat', createdAt: '2024-12-21 14:35', dialogueCount: 3 },
    { conversationId: 22, log: 'log022', name: '金融知识库', userName: 'user010', mode: 'chat', createdAt: '2024-12-22 16:20', dialogueCount: 6 },
    { conversationId: 23, log: 'log023', name: 'Agent系统对话', userName: 'user001', mode: 'chat', createdAt: '2024-12-23 09:40', dialogueCount: 8 },
    { conversationId: 24, log: 'log024', name: '医疗知识库咨询', userName: 'user002', mode: 'chat', createdAt: '2024-12-24 11:15', dialogueCount: 4 },
    { conversationId: 25, log: 'log025', name: '大模型咨询', userName: 'user003', mode: 'chat', createdAt: '2024-12-25 13:50', dialogueCount: 7 }
]

const getMockDetail: ConversationMessage[] = [
    {
        content: '今天天气好不好',
        time: '2025-10-14 11:11',
        type: 'user'
    },
    {
        content: '今天北京的天气挺好的，天气晴朗，阳光充足。根据墨迹天气信息，北京今日（2025 年 10 月 20 日）天气为晴，最低温度 1℃，最高温度 10℃，空气质量优，pm2.5 指数 10，湿度 25，西北风 2 级。',
        time: '耗时3s  花费 Token 231  2025-10-14 11:11',
        type: 'assistant'
    },
    {
        content: '你今天开心吗',
        time: '2025-10-14 11:12',
        type: 'user'
    },
    {
        content: '当然开心啦！能帮你解答天气问题，还能跟你聊天，这种互动的感觉特别好。而且每次能帮到你，看着问题一个个被解决，我就会觉得特别有价值。要不要跟我分享下你今天的心情呀？或者我帮你整理一份今日开心小事清单，咱们一起记录点快乐的瞬间？',
        time: '耗时2s  花费 Token 231  2025-10-14 11:12',
        type: 'assistant'
    }
]
//当前日志
const logList = ref<any[]>([])

//查询状态
const queryLoading = ref(false)

//分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

//抽屉
const drawerVisible = ref(false)
const currentSession = ref<any>({})
const conversationMessages = ref<ConversationMessage[]>([])

//加载对话记录
const loadConversationLogs = async (params: ConversationQueryParams = {}) => {
    try {
        queryLoading.value = true;

        const queryParams = {
            ...params,
            pageNum: currentPage.value,
            pageSize: pageSize.value
        }

        const response = await apiService.getConversationLogs(queryParams)

        logList.value = response.data.records
        total.value = response.data.total

        ElMessage.success(`数据加载完成`)
    } catch (error: any) {
        ElMessage.error(error.message || '后端加载数据失败，使用模拟数据')
        
        //api调用失败，使用模拟数据并模拟分页
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        logList.value = getMockData.slice(start, end);
        total.value = getMockData.length;
    } finally {
        queryLoading.value = false;
    }
}

//页面加载时获得数据
onMounted(() => {
    loadConversationLogs()
})

//查询
const onQuery = async () => {
    if (!formInline.user.trim() && (!formInline.date || formInline.date.length === 0)) {
        ElMessage.warning('请输入查询条件')
        return
    }

    //查询参数
    const queryParams: ConversationQueryParams = {}

    //用户
    if (formInline.user.trim()) {
        queryParams.userName = formInline.user.trim()
    }

    //时间范围
    if (formInline.date && formInline.date.length === 2) {
        const [startDate, endDate] = formInline.date
        queryParams.startTime = startDate
        queryParams.endTime = endDate
    }

    //重置到第一页
    currentPage.value = 1

    //调用api查询
    await loadConversationLogs(queryParams)
}

//重置
const onReset = () => {
    formInline.user = ''
    formInline.date = []
    
    //重置分页
    currentPage.value = 1
    pageSize.value = 10
    
    loadConversationLogs()
    ElMessage.info('已重置查询条件')
}

//详情
const onDetail = async (row: any) => {
    currentSession.value = row
    drawerVisible.value = true
    
    try {
        const response = await apiService.getConversationDetail(row.conversationId || row.log)
        conversationMessages.value = response.data
    } catch (error: any) {
        ElMessage.error('调用API获取对话详情失败，展示模拟数据')
        //模拟数据
        conversationMessages.value = getMockDetail
    }
}

//分页大小改变
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1 // 改变每页条数时，重置到第一页
    loadConversationLogs()
}

//当前页改变
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    loadConversationLogs()
}
</script>
<style scoped lang="less">
.conversation-log-page {
    width: 100%;

    .container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 40px)
    }

    .page-style {
        width: 100%;
        border: 1px solid #e4e7ed;
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    }

    .page-header {
        height: 73px;
        line-height: 73px;
        
        .page-title {
            margin: 0;
            font-size: 20px;
        }
    }

    .page-main {
        position: relative;
        margin: 20px 0;
        overflow: hidden;

        ::v-deep .input {
            width: 300px;
        }

        .log-table {
            max-height: calc(100% - 170px);
            overflow-y: auto;
            
            .table {
                width: 100%;
            }
        }

        .pagination-block {
            position: absolute;
            right: 20px;
            bottom: 20px;
            padding: 10px;
        }

        //遮罩
        .custom-drawer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
        }

        //抽屉
        .custom-drawer {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 50%;
            min-width: 600px;
            max-width: 1200px;
            background-color: #fff;
            box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
            z-index: 2;
            display: flex;
            flex-direction: column;

            .drawer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;

                .header-content {
                    flex: 1;
                    h3 {
                        font-size: 20px;
                    }
                    
                    .session-info {
                        margin-top: 10px;
                        font-size: 14px;
                        color: #909399;
                    }
                }

                .close-icon {
                    font-size: 30px;
                    cursor: pointer;
                    color: #909399;
                    &:hover {
                        color: #409eff;
                    }
                }
            }

            .drawer-body {
                display: flex;
                flex: 1;
                overflow: hidden;
                padding: 0 20px 20px;
                flex-direction: column;

                .conversation-content {
                    flex: 1;
                    padding: 20px;
                    background-color: #f0f2f5;
                    border-radius: 8px;
                    overflow-y: auto;

                    .message-item {
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 10px;

                        &.message-right {
                            align-items: flex-end;

                            .message-bubble {
                                background: #5b7ce6;
                                color: #fff;
                                border-radius: 15px;
                                max-width: 70%;
                            }
                        }

                        &.message-left {
                            align-items: flex-start;

                            .message-bubble {
                                background: #fff;
                                color: #333;
                                border-radius: 15px;
                                max-width: 70%;
                            }
                        }
                        
                        .message-bubble {
                            padding: 12px 16px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            
                            .message-text {
                                font-size: 14px;
                                line-height: 1.5;
                                word-break: break-word;
                            }
                        }

                        .message-meta {
                            display: flex;
                            gap: 10px;
                            font-size: 12px;
                            margin-top: 6px;
                            padding: 0 8px;
                            color: #909399;
                            opacity: 0;
                            visibility: hidden;
                            transition: opacity 0.3s ease, visibility 0.3s ease;
                        }

                        &:hover .message-meta {
                            opacity: 1;
                            visibility: visible;
                        }
                    }
                }
            }
        }

        //抽屉滑入滑出动画
        .drawer-slide-enter-active,
        .drawer-slide-leave-active {
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .drawer-slide-enter-from,
        .drawer-slide-leave-to {
            transform: translateX(100%);
        }

        .drawer-slide-enter-to,
        .drawer-slide-leave-from {
            transform: translateX(0);
        }
    }
}
</style>