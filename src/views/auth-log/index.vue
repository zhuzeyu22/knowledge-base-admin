<template>
    <div class="auth-log-page">
        <el-container class="container">
            <!-- 标题 -->
            <el-header class="page-header page-style">
                <h2 style="font-size: 20px;">授权记录</h2>
            </el-header>
            <!-- 下方表格 -->
            <el-main class="page-main page-style">
                <!-- 查询模块 -->
                <div class="query-table">
                    <el-form :inline="true" :model="formInline">
                        <el-form-item label="时间范围">
                            <el-date-picker class="input" v-model="formInline.date" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" clearable />
                        </el-form-item>
                        <el-form-item label="授权人">
                            <el-input class="input" v-model="formInline.authorizer" clearable />
                        </el-form-item>
                        <br>
                        <el-form-item label="被授权人">
                            <el-input class="input" v-model="formInline.authorizedUser" clearable />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onQuery" :loading="queryLoading">查询</el-button>
                            <el-button @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 授权记录表单 -->
                <div class="log-table">
                    <el-table class="table" :data="authList" style="width: 100%" :border="false" >
                        <el-table-column type="index" label="序号" min-width="100" />
                        <el-table-column prop="tenantName" label="被授权对象" min-width="130" />
                        <el-table-column prop="authorizerName" label="授权人" min-width="130" />
                        <el-table-column label="共享权限" min-width="130">
                            <template #default="scope">
                                <span>
                                    {{ scope.row.hasPermission ? '成功' : '失败' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createdAt" label="授权时间" min-width="130" />
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
import apiService, { AuthQueryParams } from '../../service/api'

const formInline = reactive({
    date: [],
    authorizer:'',
    authorizedUser:''
})

//模拟数据（匹配API接口字段）
const getMockData = [
    { permissionId: 1, tenantName: 'user10', datasetId: '001', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-01 09:30' },
    { permissionId: 2, tenantName: 'user20', datasetId: '001', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-01 10:15' },
    { permissionId: 3, tenantName: 'user20', datasetId: '002', authorizerName: 'admin21', hasPermission: false, createdAt: '2024-12-01 11:20' },
    { permissionId: 4, tenantName: 'user25', datasetId: '003', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-01 12:30' },
    { permissionId: 5, tenantName: 'user25', datasetId: '001', authorizerName: 'admin21', hasPermission: false, createdAt: '2024-12-01 13:45' },
    { permissionId: 6, tenantName: 'user10', datasetId: '001', authorizerName: 'admin22', hasPermission: true, createdAt: '2024-12-01 14:10' },
    { permissionId: 7, tenantName: 'user20', datasetId: '001', authorizerName: 'admin22', hasPermission: true, createdAt: '2024-12-01 15:25' },
    { permissionId: 8, tenantName: 'user20', datasetId: '002', authorizerName: 'admin21', hasPermission: false, createdAt: '2024-12-01 16:30' },
    { permissionId: 9, tenantName: 'user25', datasetId: '003', authorizerName: 'admin22', hasPermission: true, createdAt: '2024-12-02 09:00' },
    { permissionId: 10, tenantName: 'user25', datasetId: '001', authorizerName: 'admin21', hasPermission: false, createdAt: '2024-12-02 10:15' },
    { permissionId: 11, tenantName: 'user10', datasetId: '001', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-02 11:30' },
    { permissionId: 12, tenantName: 'user20', datasetId: '001', authorizerName: 'admin22', hasPermission: true, createdAt: '2024-12-02 12:45' },
    { permissionId: 13, tenantName: 'user20', datasetId: '002', authorizerName: 'admin21', hasPermission: false, createdAt: '2024-12-02 13:20' },
    { permissionId: 14, tenantName: 'user25', datasetId: '003', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-02 14:35' },
    { permissionId: 15, tenantName: 'user25', datasetId: '001', authorizerName: 'admin22', hasPermission: false, createdAt: '2024-12-02 15:50' },
    { permissionId: 16, tenantName: 'user10', datasetId: '001', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-03 09:10' },
    { permissionId: 17, tenantName: 'user20', datasetId: '001', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-03 10:25' },
    { permissionId: 18, tenantName: 'user20', datasetId: '002', authorizerName: 'admin22', hasPermission: false, createdAt: '2024-12-03 11:40' },
    { permissionId: 19, tenantName: 'user25', datasetId: '003', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-03 12:55' },
    { permissionId: 20, tenantName: 'user25', datasetId: '001', authorizerName: 'admin22', hasPermission: false, createdAt: '2024-12-03 14:10' },
    { permissionId: 21, tenantName: 'user10', datasetId: '001', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-03 15:25' },
    { permissionId: 22, tenantName: 'user20', datasetId: '001', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-04 09:30' },
    { permissionId: 23, tenantName: 'user20', datasetId: '002', authorizerName: 'admin22', hasPermission: false, createdAt: '2024-12-04 10:45' },
    { permissionId: 24, tenantName: 'user25', datasetId: '003', authorizerName: 'admin21', hasPermission: true, createdAt: '2024-12-04 11:50' },
    { permissionId: 25, tenantName: 'user25', datasetId: '001', authorizerName: 'admin22', hasPermission: false, createdAt: '2024-12-04 13:05' }
]
//当前显示的登录列表
const authList = ref<any[]>([])

//查询加载状态
const queryLoading = ref(false)

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

//加载列表
const loadAuthLogs = async(params:AuthQueryParams = {}) =>{
    try{
        queryLoading.value = true;
        const queryParams = {
            ...params,
            pageNum: currentPage.value,
            pageSize: pageSize.value
        }
        const response = await apiService.getAuthLogs(queryParams)

        authList.value = response.data.records
        total.value = response.data.total
        ElMessage.success(`数据加载完成`)
    } catch(error:any) {
        ElMessage.error(error.message || '后端加载数据失败')
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        authList.value = getMockData.slice(start,end)
        total.value = getMockData.length
    } finally {
        queryLoading.value = false
    }
}

onMounted(() => {
    loadAuthLogs()
})

//查询
const onQuery = async () => {
    if ((!formInline.date || formInline.date.length === 0)
     && !formInline.authorizer.trim() && !formInline.authorizedUser.trim()) {
        ElMessage.warning('请输入查询条件')
        return
    }

    const queryParams:AuthQueryParams = {}

    //时间范围
    if (formInline.date && formInline.date.length === 2) {
        const [startDate, endDate] = formInline.date
        queryParams.startTime = startDate
        queryParams.endTime = endDate
    }

    //授权人
    if (formInline.authorizer.trim()) {
        queryParams.authorizerName = formInline.authorizer
    }

    //被授权人
    if (formInline.authorizedUser.trim()) {
        queryParams.tenantName = formInline.authorizedUser
    }

    currentPage.value = 1
    await loadAuthLogs(queryParams)
}

//重置
const onReset = () => {
    formInline.date = []
    formInline.authorizer = ''
    formInline.authorizedUser = ''
    currentPage.value = 1
    pageSize.value = 10
    loadAuthLogs()
    ElMessage.info('已重置查询条件')
}
const handleSizeChange = (val:number) => {
    pageSize.value = val
    currentPage.value = 1
    loadAuthLogs()
}
const handleCurrentChange =(val:number) => {
    currentPage.value = val
    loadAuthLogs()
}
</script>
<style scoped lang="less">
.auth-log-page {
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
            width: 280px;
        }

        .log-table{
            max-height: calc(100% - 170px);
            overflow-y: auto;
        }
        .pagination-block{
            position: absolute;
            right: 20px;
            bottom: 20px;
            padding: 10px;
        }
    }

}
</style>