<template>
    <div class="conversation-log-page">
        <el-container class="container">
            <!-- 标题 -->
            <el-header class="page-header page-style">
                <h2 style="font-size: 20px;">对话记录</h2>
            </el-header>
            <!-- 下方表格 -->
            <el-main class="page-main page-style">
                <!-- 查询模块表格 -->
                <div class="query-table">
                    <el-form :inline="true" :model="formInline">
                        <el-form-item label="会话标识">
                            <el-input class="input" v-model="formInline.log" clearable />
                        </el-form-item>
                        <el-form-item label="用户标识">
                            <el-input class="input" v-model="formInline.user" clearable />
                        </el-form-item>
                        <br>
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
                    <el-table class="table" :data="logList" style="width: 100%" :border="false" stripe>
                        <el-table-column prop="id" label="序号" min-width="100" />
                        <el-table-column prop="log" label="会话标识" min-width="130" />
                        <el-table-column prop="user" label="用户标识" min-width="130" />
                        <el-table-column prop="dataset" label="涉及知识库" min-width="130" />
                        <el-table-column prop="date" label="开始时间" min-width="130" />
                        <el-table-column prop="rounds" label="对话轮数" min-width="100" />
                        <el-table-column label="操作" min-width="100">
                            <template #default="scope">
                                <el-button link type="primary" @click="onDetail(scope.row)">
                                    查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
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
            </el-main>
        </el-container>

    </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import apiService, { ConversationQueryParams } from '../../service/api'

const formInline = reactive({
    log: '',
    user: '',
    date: [],
})


//模拟数据，调用api失败显示
const getMockData = [
    { id: '1', log: 'log001', user: 'user001', dataset: '法律知识库', date: '2024-12-01 09:30', rounds: '3' },
    { id: '2', log: 'log002', user: 'user002', dataset: '医疗知识库', date: '2024-12-02 14:15', rounds: '5' },
    { id: '3', log: 'log003', user: 'user001', dataset: '法律知识库', date: '2024-12-03 16:45', rounds: '2' },
    { id: '4', log: 'log004', user: 'user003', dataset: '技术知识库', date: '2024-12-04 10:20', rounds: '7' },
    { id: '5', log: 'log005', user: 'user002', dataset: '医疗知识库', date: '2024-12-05 13:10', rounds: '4' },
    { id: '6', log: 'log006', user: 'user004', dataset: '教育知识库', date: '2024-12-06 15:30', rounds: '6' },
    { id: '7', log: 'log007', user: 'user005', dataset: '金融知识库', date: '2024-12-07 10:00', rounds: '8' },
    { id: '8', log: 'log008', user: 'user006', dataset: '法律知识库', date: '2024-12-08 11:20', rounds: '3' },
    { id: '9', log: 'log009', user: 'user007', dataset: '医疗知识库', date: '2024-12-09 13:45', rounds: '5' },
    { id: '10', log: 'log010', user: 'user008', dataset: '技术知识库', date: '2024-12-10 15:30', rounds: '4' },
    { id: '11', log: 'log011', user: 'user009', dataset: '教育知识库', date: '2024-12-11 09:15', rounds: '6' },
    { id: '12', log: 'log012', user: 'user010', dataset: '金融知识库', date: '2024-12-12 10:40', rounds: '7' },
    { id: '13', log: 'log013', user: 'user001', dataset: '法律知识库', date: '2024-12-13 14:20', rounds: '2' },
    { id: '14', log: 'log014', user: 'user002', dataset: '医疗知识库', date: '2024-12-14 16:00', rounds: '5' },
    { id: '15', log: 'log015', user: 'user003', dataset: '技术知识库', date: '2024-12-15 09:50', rounds: '8' },
    { id: '16', log: 'log016', user: 'user004', dataset: '教育知识库', date: '2024-12-16 11:30', rounds: '3' },
    { id: '17', log: 'log017', user: 'user005', dataset: '金融知识库', date: '2024-12-17 13:10', rounds: '6' },
    { id: '18', log: 'log018', user: 'user006', dataset: '法律知识库', date: '2024-12-18 15:45', rounds: '4' },
    { id: '19', log: 'log019', user: 'user007', dataset: '医疗知识库', date: '2024-12-19 10:25', rounds: '7' },
    { id: '20', log: 'log020', user: 'user008', dataset: '技术知识库', date: '2024-12-20 12:00', rounds: '5' },
    { id: '21', log: 'log021', user: 'user009', dataset: '教育知识库', date: '2024-12-21 14:35', rounds: '3' },
    { id: '22', log: 'log022', user: 'user010', dataset: '金融知识库', date: '2024-12-22 16:20', rounds: '6' },
    { id: '23', log: 'log023', user: 'user001', dataset: '法律知识库', date: '2024-12-23 09:40', rounds: '8' },
    { id: '24', log: 'log024', user: 'user002', dataset: '医疗知识库', date: '2024-12-24 11:15', rounds: '4' },
    { id: '25', log: 'log025', user: 'user003', dataset: '技术知识库', date: '2024-12-25 13:50', rounds: '7' }
]

//当前显示的日志列表
const logList = ref<any[]>([])

//查询加载状态
const queryLoading = ref(false)

//分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

//加载对话记录
const loadConversationLogs = async (params: ConversationQueryParams = {}) => {
    try {
        queryLoading.value = true;

        const queryParams = {
            ...params,
            page: currentPage.value,
            pageSize: pageSize.value
        }

        const response = await apiService.getConversationLogs(queryParams)

        logList.value = response.data
        total.value = response.total

        ElMessage.success(`加载完成，共${response.total}条记录`)
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
    if (!formInline.log.trim() && !formInline.user.trim() && (!formInline.date || formInline.date.length === 0)) {
        ElMessage.warning('请输入查询条件')
        return
    }

    //查询参数
    const queryParams: ConversationQueryParams = {}

    //会话标识
    if (formInline.log.trim()) {
        queryParams.log = formInline.log.trim()
    }

    //用户标识
    if (formInline.user.trim()) {
        queryParams.user = formInline.user.trim()
    }

    //时间范围
    if (formInline.date && formInline.date.length === 2) {
        const [startDate, endDate] = formInline.date
        queryParams.startDate = startDate
        queryParams.endDate = endDate
    }

    //重置到第一页
    currentPage.value = 1

    //调用api查询
    await loadConversationLogs(queryParams)
}

//重置
const onReset = () => {
    formInline.log = ''
    formInline.user = ''
    formInline.date = []
    
    //重置分页
    currentPage.value = 1
    pageSize.value = 10
    
    loadConversationLogs()
    ElMessage.info('已重置查询条件')
}

//详情
const onDetail = (row: any) => {
    ElMessage.info(`查看会话 ${row.log} 的详细信息`)
    //跳转到详情页面或打开详情弹窗
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
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    }

    .page-header {
        height: 73px;
        line-height: 73px;
    }

    .page-main {
        position: relative;
        margin: 20px 0;
        min-height: 700px;

        ::v-deep .input {
            width: 300px;
        }

        .log-table {
            max-height: calc(100% - 160px);
            overflow-y: auto;
        }

        .pagination-block {
            position: absolute;
            right: 20px;
            bottom: 20px;
            padding: 10px;
        }
    }

}
</style>