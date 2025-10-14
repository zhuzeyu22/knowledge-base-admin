<template>
    <div class="login-log-page">
        <el-container>
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
                    <el-table class="table" :data="loginList" style="width: 100%" :border="false" stripe>
                        <el-table-column prop="id" label="序号" min-width="100" />
                        <el-table-column prop="user" label="用户标识" min-width="130" />
                        <el-table-column prop="type" label="操作类型" min-width="130" />
                        <el-table-column prop="date" label="开始时间" min-width="130" />
                        <el-table-column prop="operation" label="操作描述" min-width="100" />
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
    user: '',
    date: [],
})

const originalLoginList = [
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
    }
]
//当前显示的登录列表
const loginList = ref([...originalLoginList])

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
    if ( !formInline.user.trim() && (!formInline.date || formInline.date.length === 0)) {
        ElMessage.warning('请输入查询条件')
        return
    }

    queryLoading.value = true

    try {
        //模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        let filteredList = [...originalLoginList]
        
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
        
        loginList.value = filteredList
        
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
    formInline.user = ''
    formInline.date = []
    loginList.value = [...originalLoginList]
    ElMessage.info('已重置查询条件')
}
</script>
<style scoped lang="less">
.login-log-page {
    width: 1200px;
    height: 100%;

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
            width: 300px;
        }

    }

}
</style>