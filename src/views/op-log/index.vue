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
                            <el-select class="input" v-model="formInline.action_type" clearable @change="handleActionTypeChange">
                                <el-option
                                v-for="value in actionTypeOptions"
                                :key="value.value"
                                :label="value.label"
                                :value="value.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 登录表单 -->
                <div class="login-table">
                    <el-table class="table" :data="loginList" style="width: 100%" :border="false" >
                        <el-table-column prop="created_at" label="时间" min-width="100" />
                        <el-table-column prop="operator_name" label="操作人" min-width="80" />
                        <el-table-column prop="action_type" label="操作" min-width="80" >
                            <template #default="scope">
                                <span>
                                    {{ actionTypeOptions.find(x => x.value == scope.row.action_type)?.label || scope.row.action_type }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" label="操作内容" min-width="130" />
                    </el-table>
                </div>
                <div class="pagination-block">
                    <el-pagination 
                        v-model:current-page="page" 
                        v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]"
                        :background="true"
                        layout="sizes, prev, pager, next" 
                        :total="total"
                        @current-change="handlePageChange"
                        @size-change="handlePageSizeChange"
                        prev-text="< 上一页"
                        next-text="下一页 >" />
                </div>
            </el-main>
        </el-container>

    </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import apiService, { OptionLog, OptionType } from '@/service/api'

const formInline = reactive({
    action_type: '',
})

const actionTypeOptions = ref<OptionType[]>([])

//模拟数据（匹配API接口字段）
//当前显示的登录列表
const loginList = ref<OptionLog[]>([])

//查询加载状态
const queryLoading = ref(false)

//分页相关
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);

const loadLoginLogs = async () => {
    queryLoading.value = true
    let params = {
        page:page.value, 
        limit:pageSize.value,
    }
    if(formInline.action_type){
        params.action_type = formInline.action_type
    }
    apiService.getOptionLog(params).then((res) => {
        console.log(res);
        loginList.value = res.data.map(item => ({
            ...item,
            created_at:formatTime(item.created_at),
            // action_type:
        }));
        console.log(loginList.value)
        
        total.value = res.total;
        console.log(total.value);
    }).finally(() => {
        queryLoading.value = false
    })
}
const formatTime = (time:string) => {
    const date = new Date(time) 
    return date.toLocaleString('zh-CN', {
        year:'numeric',
        month:'2-digit',
        day:'2-digit',
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit'
    })
}
const updateActionTypeOptions = async () => {
    const res = await apiService.getOptionLogTypes()
    actionTypeOptions.value = res.data
}

onMounted(() =>{
    updateActionTypeOptions()
    loadLoginLogs()
})


const handlePageChange = () => {
    loadLoginLogs();
}

const handlePageSizeChange = () => {
    loadLoginLogs();
}

const handleActionTypeChange = () =>{
    page.value = 1
    loadLoginLogs();
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