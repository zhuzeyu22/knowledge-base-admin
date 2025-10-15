<template>
    <div class="conversation-log-page">
        <el-container>
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
            </el-main>
        </el-container>

    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const formInline = reactive({
    log: '',
    user: '',
    date: [],
})

const originalLogList = [
    {
        id: '1',
        log: 'log001',
        user: 'user001',
        dataset: '法律知识库',
        date: '2024-12-01 09:30',
        rounds: '3'
    },
    {
        id: '2',
        log: 'log002',
        user: 'user002',
        dataset: '医疗知识库',
        date: '2024-12-02 14:15',
        rounds: '5'
    },
    {
        id: '3',
        log: 'log003',
        user: 'user001',
        dataset: '法律知识库',
        date: '2024-12-03 16:45',
        rounds: '2'
    },
    {
        id: '4',
        log: 'log004',
        user: 'user003',
        dataset: '技术知识库',
        date: '2024-12-04 10:20',
        rounds: '7'
    },
    {
        id: '5',
        log: 'log005',
        user: 'user002',
        dataset: '医疗知识库',
        date: '2024-12-05 13:10',
        rounds: '4'
    },
    {
        id: '6',
        log: 'log006',
        user: 'user004',
        dataset: '教育知识库',
        date: '2024-12-06 15:30',
        rounds: '6'
    }
]

//当前显示的日志列表
const logList = ref([...originalLogList])

//查询加载状态
const queryLoading = ref(false)

//格式化日期为可比较的格式
const formatDate = (dateStr: string) => {
    return new Date(dateStr.replace(' ', 'T'))
}

//检查日期是否在范围内
const isDateInRange = (dateStr: string, startDate: Date, endDate: Date) => {
    const date = formatDate(dateStr)
    return date >= startDate && date <= endDate
}

//查询
const onQuery = async () => {
    // 检查是否所有输入框都为空
    if (!formInline.log.trim() && !formInline.user.trim() && (!formInline.date || formInline.date.length === 0)) {
        ElMessage.warning('请输入查询条件')
        return
    }

    queryLoading.value = true

    try {
        //模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))

        let filteredList = [...originalLogList]

        //会话标识
        if (formInline.log.trim()) {
            filteredList = filteredList.filter(item =>
                item.log.toLowerCase().includes(formInline.log.trim().toLowerCase())
            )
        }

        //用户标识
        if (formInline.user.trim()) {
            filteredList = filteredList.filter(item =>
                item.user.toLowerCase().includes(formInline.user.trim().toLowerCase())
            )
        }

        //时间范围
        if (formInline.date && formInline.date.length === 2) {
            const [startDate, endDate] = formInline.date
            filteredList = filteredList.filter(item =>
                isDateInRange(item.date, startDate, endDate)
            )
        }

        logList.value = filteredList

        ElMessage.success(`查询完成，共找到 ${filteredList.length} 条记录`)

    } catch (error) {
        ElMessage.error('查询失败，请重试')
        console.error('查询错误:', error)
    } finally {
        queryLoading.value = false
    }
}

//重置
const onReset = () => {
    formInline.log = ''
    formInline.user = ''
    formInline.date = []
    logList.value = [...originalLogList]
    ElMessage.info('已重置查询条件')
}

//详情
const onDetail = (row: any) => {
    ElMessage.info(`查看会话 ${row.log} 的详细信息`)
    //跳转到详情页面或打开详情弹窗

}
</script>
<style scoped lang="less">
.conversation-log-page {
    width: 100%;
    min-height: (100vh - 73px);
    box-sizing: border-box;

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
        margin: 20px 0;
        min-height: 700px;

        ::v-deep .input {
            width: 300px;
        }

        .log-table {
            max-height: calc(100% - 120px);
            overflow-y: auto;
        }
    }

}
</style>