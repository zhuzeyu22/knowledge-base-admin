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
                            <el-button type="primary" @click="onQuery">查询</el-button>
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
                            <el-button link type="primary" @click="onDetail">
                                查看
                            </el-button>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>

    </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

const formInline = reactive({
    log: '',
    user: '',
    date: [],
})

const logList = [
    {
        id: '1',
        log: 'log1',
        user: 'user1',
        dataset: '法律知识库',
        date: '2025-10-14 18:00',
        rounds: '3'
    },
    {
        id: '2',
        log: 'log2',
        user: 'user3',
        dataset: '法律知识库',
        date: '2025-10-14 18:00',
        rounds: '3'
    },
    {
        id: '3',
        log: 'log3',
        user: 'user3',
        dataset: '法律知识库',
        date: '2025-10-14 18:00',
        rounds: '3'
    },

]
const onQuery = () => {
    alert('Query!')
}

const onReset = () => {
    formInline.log = ''
    formInline.user = ''
    formInline.date = []
}

const onDetail = () => {
    alert('detail')
}
</script>
<style scoped lang="less">
.conversation-log-page {
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