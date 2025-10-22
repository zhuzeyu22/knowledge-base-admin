<template>
    <div class="login-log-page">
        <el-container class="container">
            <!-- 标题 -->
            <el-header class="page-header page-style">
                <h2 style="font-size: 20px;">登录日志</h2>
            </el-header>
            <!-- 下方表格 -->
            <el-main class="page-main page-style">
                <!-- 查询模块 -->
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
                <!-- 登录表单 -->
                <div class="login-table">
                    <el-table class="table" :data="loginList" style="width: 100%" :border="false" >
                        <el-table-column prop="id" label="序号" min-width="100" />
                        <el-table-column prop="user" label="用户标识" min-width="130" />
                        <el-table-column prop="type" label="操作类型" min-width="130" />
                        <el-table-column prop="date" label="开始时间" min-width="130" />
                        <el-table-column prop="operation" label="操作描述" min-width="100" />
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
import apiService, { LoginQueryParams } from '../../service/api'

const formInline = reactive({
    user: '',
    date: [],
})

const getMockData = [
    {
        id: '1',
        user: 'user001',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录成功'
    },
    {
        id: '2',
        user: 'user002',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录失败'
    },
    {
        id: '3',
        user: 'user003',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录成功'
    },
    {
        id: '4',
        user: 'user004',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录失败'
    },
    {
        id: '5',
        user: 'user001',
        type: '注册',
        date: '2024-12-01 09:30',
        operation: '注册成功'
    },
    {
        id: '6',
        user: 'user001',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录成功'
    },
    {
        id: '7',
        user: 'user002',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录失败'
    },
    {
        id: '8',
        user: 'user003',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录成功'
    },
    {
        id: '9',
        user: 'user004',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录失败'
    },
    {
        id: '10',
        user: 'user001',
        type: '注册',
        date: '2024-12-01 09:30',
        operation: '注册成功'
    },
    {
        id: '11',
        user: 'user001',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录成功'
    },
    {
        id: '12',
        user: 'user002',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录失败'
    },
    {
        id: '13',
        user: 'user003',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录成功'
    },
    {
        id: '14',
        user: 'user004',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录失败'
    },
    {
        id: '15',
        user: 'user001',
        type: '注册',
        date: '2024-12-01 09:30',
        operation: '注册成功'
    },
    {
        id: '16',
        user: 'user001',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录成功'
    },
    {
        id: '17',
        user: 'user002',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录失败'
    },
    {
        id: '18',
        user: 'user003',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录成功'
    },
    {
        id: '19',
        user: 'user004',
        type: '登录',
        date: '2024-12-01 09:30',
        operation: '登录失败'
    },
    {
        id: '20',
        user: 'user001',
        type: '注册',
        date: '2024-12-01 09:30',
        operation: '注册成功'
    },
    {
        id: '21',
        user: 'user001',
        type: '注册',
        date: '2024-12-01 09:30',
        operation: '注册成功'
    },
]
//当前显示的登录列表
const loginList = ref<any[]>([])

//查询加载状态
const queryLoading = ref(false)

//分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadLoginLogs = async (params: LoginQueryParams = {}) => {
    try {
        queryLoading.value = true;
        const queryParams = {
            ...params,
            page: currentPage.value,
            pageSize: pageSize.value
        }
        const response = await apiService.getLoginLogs(queryParams)

        loginList.value = response.records
        total.value = response.total

        ElMessage.success(`加载完成，共${response.total}条记录`)
    } catch (error: any) {
        ElMessage.error(error.message || '后端加载数据失败')
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        loginList.value = getMockData.slice(start, end);
        total.value = getMockData.length;
    } finally {
        queryLoading.value = false;
    }
}

onMounted(() =>{
    loadLoginLogs()
})

//查询
const onQuery = async () => {
    // 检查是否所有输入框都为空
    if (!formInline.user.trim() && (!formInline.date || formInline.date.length === 0)) {
        ElMessage.warning('请输入查询条件')
        return
    }
    
    const queryParams:LoginQueryParams = {}

    //用户
    if(formInline.user.trim()){
        queryParams.userName = formInline.user.trim()
    }
    //date
    if(formInline.date && formInline.date.length === 2){
        const [startDate, endDate] = formInline.date
        queryParams.loginStartTime = startDate
        queryParams.loginEndTime = endDate
    }

    //重置到第一页
    currentPage.value = 1

    await loadLoginLogs(queryParams)
}

//重置
const onReset = () => {
    formInline.user = ''
    formInline.date = []
    currentPage.value = 1
    pageSize.value = 10
    loadLoginLogs()
    ElMessage.info('已重置查询条件')
}

//分页大小改变
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1 // 改变每页条数时，重置到第一页
    loadLoginLogs()
}

//当前页改变
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    loadLoginLogs()
}
</script>
<style scoped lang="less">
.login-log-page {
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
    }

    .page-main {
        position: relative;
        margin: 20px 0;

        ::v-deep .input {
            width: 300px;
        }

        .login-table{
            max-height: calc(100% - 120px);
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