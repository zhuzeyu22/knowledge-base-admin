<template>
    <div class="auth-log-page">
        <el-container>
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
                        <el-table-column label="详情" min-width="100">
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
    authorizationId:'',
    date: [],
    dataset:'',
    authorizer:'',
    authorizedUser:''
})

const originalAuthList = [
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
    }
]
//当前显示的登录列表
const authList = ref([...originalAuthList])

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
    if (!formInline.authorizationId.trim() && (!formInline.date || formInline.date.length === 0)
     && !formInline.dataset.trim() && !formInline.authorizer.trim() && !formInline.authorizedUser.trim()) {
        ElMessage.warning('请输入查询条件')
        return
    }

    queryLoading.value = true

    try {
        //模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        let filteredList = [...originalAuthList]
        
        //授权ID
        if (formInline.authorizationId.trim()) {
            filteredList = filteredList.filter(item => 
                item.authorizationId.toLowerCase().includes(formInline.authorizationId.trim().toLowerCase())
            )
        }

        //时间范围
        if (formInline.date && formInline.date.length === 2) {
            const [startDate, endDate] = formInline.date
            filteredList = filteredList.filter(item => 
                isDateInRange(item.date, startDate, endDate)
            )
        }
        
        //知识库
        if (formInline.dataset.trim()) {
            filteredList = filteredList.filter(item => 
                item.dataset.toLowerCase().includes(formInline.dataset.trim().toLowerCase())
            )
        }

        //授权人
        if (formInline.authorizer.trim()) {
            filteredList = filteredList.filter(item => 
                item.authorizor.toLowerCase().includes(formInline.authorizer.trim().toLowerCase())
            )
        }

        //被授权人
        if (formInline.authorizedUser.trim()) {
            filteredList = filteredList.filter(item => 
                item.authorizedUser.toLowerCase().includes(formInline.authorizedUser.trim().toLowerCase())
            )
        }
        
        authList.value = filteredList
        
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
    formInline.authorizationId = ''
    formInline.date = []
    formInline.dataset = ''
    formInline.authorizer = ''
    formInline.authorizedUser = ''
    authList.value = [...originalAuthList]
    ElMessage.info('已重置查询条件')
}
//详情
const onDetail = (row: any) => {
    ElMessage.info(`查看授权 ${row.authorizationId} 的详细信息`)
    //跳转到详情页面或打开详情弹窗
    
}
</script>
<style scoped lang="less">
.auth-log-page {
    width: 100%;
    height: 100vh;

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
        height: 700px;

        ::v-deep .input {
            width: 280px;
        }

    }

}
</style>