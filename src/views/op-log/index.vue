<template>
    <div class="login-log-page">
        <el-container class="container">
            <!-- 标题 -->
            <el-header class="page-header page-style">
                <h2 style="font-size: 20px;">操作记录</h2>
            </el-header>
            <!-- 下方表格 -->
            <el-main class="page-main page-style">
                <!-- 查询模块 -->
                <div class="query-table">
                    <el-form :inline="true" :model="formInline">
                        <el-form-item label="操作类型">
                            <el-input class="input" v-model="formInline.user" clearable />
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 登录表单 -->
                <div class="login-table">
                    <el-table class="table" :data="loginList" style="width: 100%" :border="false" >
                        <el-table-column type="index" label="序号" min-width="100" />
                        <el-table-column prop="userName" label="用户标识" min-width="130" />
                        <el-table-column prop="loginMethod" label="登录方式" min-width="130" />
                        <el-table-column prop="loginAt" label="登录时间" min-width="130" />
                        <el-table-column label="登录状态" min-width="100">
                            <template #default="scope">
                                <span>
                                    {{ scope.row.success ? '登录成功' : '登录失败' }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-block">
                    <el-pagination 
                        v-model:current-page="currentPage" 
                        v-model:page-size="pageSize"
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

// 保存当前查询参数
const currentQueryParams = ref<LoginQueryParams>({})

//模拟数据（匹配API接口字段）
const getMockData = [
    { loginId: 'login001', userName: 'user001', loginAt: '2024-12-01 09:30', loginMethod: 'password', success: true },
    { loginId: 'login002', userName: 'user002', loginAt: '2024-12-01 10:15', loginMethod: 'password', success: false },
    { loginId: 'login003', userName: 'user003', loginAt: '2024-12-01 11:20', loginMethod: 'password', success: true },
    { loginId: 'login004', userName: 'user004', loginAt: '2024-12-01 12:30', loginMethod: 'sms', success: false },
    { loginId: 'login005', userName: 'user001', loginAt: '2024-12-01 13:45', loginMethod: 'password', success: true },
    { loginId: 'login006', userName: 'user005', loginAt: '2024-12-01 14:10', loginMethod: 'wechat', success: true },
    { loginId: 'login007', userName: 'user002', loginAt: '2024-12-01 15:25', loginMethod: 'password', success: false },
    { loginId: 'login008', userName: 'user006', loginAt: '2024-12-01 16:30', loginMethod: 'password', success: true },
    { loginId: 'login009', userName: 'user007', loginAt: '2024-12-02 09:00', loginMethod: 'sms', success: true },
    { loginId: 'login010', userName: 'user008', loginAt: '2024-12-02 10:15', loginMethod: 'password', success: false },
    { loginId: 'login011', userName: 'user001', loginAt: '2024-12-02 11:30', loginMethod: 'password', success: true },
    { loginId: 'login012', userName: 'user009', loginAt: '2024-12-02 12:45', loginMethod: 'wechat', success: true },
    { loginId: 'login013', userName: 'user003', loginAt: '2024-12-02 13:20', loginMethod: 'password', success: true },
    { loginId: 'login014', userName: 'user010', loginAt: '2024-12-02 14:35', loginMethod: 'password', success: false },
    { loginId: 'login015', userName: 'user004', loginAt: '2024-12-02 15:50', loginMethod: 'sms', success: true },
    { loginId: 'login016', userName: 'user002', loginAt: '2024-12-03 09:10', loginMethod: 'password', success: true },
    { loginId: 'login017', userName: 'user005', loginAt: '2024-12-03 10:25', loginMethod: 'password', success: false },
    { loginId: 'login018', userName: 'user006', loginAt: '2024-12-03 11:40', loginMethod: 'wechat', success: true },
    { loginId: 'login019', userName: 'user007', loginAt: '2024-12-03 12:55', loginMethod: 'password', success: true },
    { loginId: 'login020', userName: 'user008', loginAt: '2024-12-03 14:10', loginMethod: 'password', success: false },
    { loginId: 'login021', userName: 'user009', loginAt: '2024-12-03 15:25', loginMethod: 'sms', success: true }
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
            pageNum: currentPage.value,
            pageSize: pageSize.value
        }
        const response = await apiService.getLoginLogs(queryParams)

        loginList.value = response.data.records
        total.value = response.data.total

        ElMessage.success(`数据加载完成`)
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
        
        // 格式化日期为 YYYY-MM-DD HH:mm:ss 格式
        const formatDateTime = (date: Date, isEnd = false) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const time = isEnd ? '23:59:59' : '00:00:00'
            return `${year}-${month}-${day} ${time}`
        }
        
        queryParams.loginStartTime = formatDateTime(startDate, false)
        queryParams.loginEndTime = formatDateTime(endDate, true)
    }

    // 保存查询参数
    currentQueryParams.value = queryParams

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
    // 清空查询参数
    currentQueryParams.value = {}
    loadLoginLogs()
    ElMessage.info('已重置查询条件')
}

//分页大小改变
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1 // 改变每页条数时，重置到第一页
    // 使用保存的查询参数
    loadLoginLogs(currentQueryParams.value)
}

//当前页改变
const handleCurrentChange = (val: number) => {
    currentPage.value = val
    // 使用保存的查询参数
    loadLoginLogs(currentQueryParams.value)
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