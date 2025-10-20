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
                        <el-form-item label="授权ID">
                            <el-input class="input" v-model="formInline.authorizationId" clearable />
                        </el-form-item>
                        <el-form-item label="时间范围">
                            <el-date-picker class="input" v-model="formInline.date" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" clearable />
                        </el-form-item>
                        <el-form-item label="关联知识库">
                            <el-input class="input" v-model="formInline.dataset" clearable />
                        </el-form-item>
                        <br>
                        <el-form-item label="授权人">
                            <el-input class="input" v-model="formInline.authorizer" clearable />
                        </el-form-item>
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
                    <el-table class="table" :data="authList" style="width: 100%" :border="false" stripe>
                        <el-table-column prop="id" label="序号" min-width="100" />
                        <el-table-column prop="authorizationId" label="授权ID" min-width="100" />
                        <el-table-column prop="authorizedUser" label="被授权对象" min-width="100" />
                        <el-table-column prop="dataset" label="关联知识库" min-width="130" />
                        <el-table-column prop="datasetId" label="知识库ID" min-width="130" />
                        <el-table-column prop="authorizor" label="授权人" min-width="130" />
                        <el-table-column prop="type" label="授权类型" min-width="130" />
                        <el-table-column prop="date" label="授权时间" min-width="130" />
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
import apiService, { AuthQueryParams } from '@/service/api'

const formInline = reactive({
    authorizationId:'',
    date: [],
    dataset:'',
    authorizer:'',
    authorizedUser:''
})

const getMockData = [
    {
        id: '1',
        authorizationId:'01',
        authorizedUser:'user10',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '2',
        authorizationId:'02',
        authorizedUser:'user20',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可编辑',
        date:'2024-12-01 09:30'
    },
    {
        id: '3',
        authorizationId:'03',
        authorizedUser:'user20',
        dataset:'共享知识库B',
        datasetId:'002',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '4',
        authorizationId:'04',
        authorizedUser:'user25',
        dataset:'共享知识库C',
        datasetId:'003',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '5',
        authorizationId:'05',
        authorizedUser:'user25',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '6',
        authorizationId:'01',
        authorizedUser:'user10',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '7',
        authorizationId:'02',
        authorizedUser:'user20',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可编辑',
        date:'2024-12-01 09:30'
    },
    {
        id: '8',
        authorizationId:'03',
        authorizedUser:'user20',
        dataset:'共享知识库B',
        datasetId:'002',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '9',
        authorizationId:'04',
        authorizedUser:'user25',
        dataset:'共享知识库C',
        datasetId:'003',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '10',
        authorizationId:'05',
        authorizedUser:'user25',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '11',
        authorizationId:'01',
        authorizedUser:'user10',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '12',
        authorizationId:'02',
        authorizedUser:'user20',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可编辑',
        date:'2024-12-01 09:30'
    },
    {
        id: '13',
        authorizationId:'03',
        authorizedUser:'user20',
        dataset:'共享知识库B',
        datasetId:'002',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '14',
        authorizationId:'04',
        authorizedUser:'user25',
        dataset:'共享知识库C',
        datasetId:'003',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '15',
        authorizationId:'05',
        authorizedUser:'user25',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '16',
        authorizationId:'01',
        authorizedUser:'user10',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '17',
        authorizationId:'02',
        authorizedUser:'user20',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可编辑',
        date:'2024-12-01 09:30'
    },
    {
        id: '18',
        authorizationId:'03',
        authorizedUser:'user20',
        dataset:'共享知识库B',
        datasetId:'002',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '19',
        authorizationId:'04',
        authorizedUser:'user25',
        dataset:'共享知识库C',
        datasetId:'003',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '20',
        authorizationId:'05',
        authorizedUser:'user25',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '21',
        authorizationId:'01',
        authorizedUser:'user10',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '22',
        authorizationId:'02',
        authorizedUser:'user20',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可编辑',
        date:'2024-12-01 09:30'
    },
    {
        id: '23',
        authorizationId:'03',
        authorizedUser:'user20',
        dataset:'共享知识库B',
        datasetId:'002',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    },
    {
        id: '24',
        authorizationId:'04',
        authorizedUser:'user25',
        dataset:'共享知识库C',
        datasetId:'003',
        authorizor:'admin21',
        type:'可管理',
        date:'2024-12-01 09:30'
    },
    {
        id: '25',
        authorizationId:'05',
        authorizedUser:'user25',
        dataset:'共享知识库A',
        datasetId:'001',
        authorizor:'admin21',
        type:'可查看',
        date:'2024-12-01 09:30'
    }
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
            page:currentPage.value,
            pageSize:pageSize.value
        }
        const response = await apiService.getAuthLogs(queryParams)

        authList.value = response.data
        total.value = response.total
        ElMessage.success(`加载完成，共${response.total}条记录`)
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
    if (!formInline.authorizationId.trim() && (!formInline.date || formInline.date.length === 0)
     && !formInline.dataset.trim() && !formInline.authorizer.trim() && !formInline.authorizedUser.trim()) {
        ElMessage.warning('请输入查询条件')
        return
    }

    const queryParams:AuthQueryParams = {}

    //授权ID
    if (formInline.authorizationId.trim()) {
        queryParams.authorizationId = Number(formInline.authorizationId.trim())
    }

    //时间范围
    if (formInline.date && formInline.date.length === 2) {
        const [startDate, endDate] = formInline.date
        queryParams.startDate = startDate
        queryParams.endDate = endDate
    }
    
    //知识库
    if (formInline.dataset.trim()) {
        queryParams.dataset = formInline.dataset
    }

    //授权人
    if (formInline.authorizer.trim()) {
        queryParams.authorizer = formInline.authorizer
    }

    //被授权人
    if (formInline.authorizedUser.trim()) {
        queryParams.authorizedUser = formInline.authorizer
    }

    currentPage.value = 1
    await loadAuthLogs(queryParams)
}

//重置
const onReset = () => {
    formInline.authorizationId = ''
    formInline.date = []
    formInline.dataset = ''
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

        ::v-deep .input {
            width: 280px;
        }

        .log-table{
            max-height: calc(100% - 300px);
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