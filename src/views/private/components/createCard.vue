<template>
    <el-card class="create-card-wrap">
        <div class="create-card">
            <el-image class="background" />
            <div class="content">
                <div class="description">导入您自己的文本数据，支持包括但不限于PDF、Word、csv等主流文档格式。</div>
                <el-button type="primary" plain @click="handleCreateClick">创建知识库</el-button>
            </div>
        </div>
    </el-card>
    <!-- <el-dialog v-model="dialogVisible" title="新建知识库" width="800">
        <div class="dialog-content">
            <el-col>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="6">
                        <el-image></el-image>
                    </el-col>
                    <el-col :span="18">
                        <el-input v-model="knowledgeBaseName" placeholder="请输入知识库名称"></el-input>
                        <el-input type="textarea" v-model="knowledgeBaseDescription" placeholder="请输入知识库简介" rows="4"
                            style="margin-top: 10px;"></el-input>
                    </el-col>
                </el-row>
                <el-row style="align-items: flex-start;">
                    <el-col :span="6">
                        知识库标签
                    </el-col>
                    <el-col :span="18">
                        <el-radio-group v-model="knowledgeBaseTag" size="small">
                            <el-radio-button label="official">官方</el-radio-button>
                            <el-radio-button label="unofficial">非官方</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </el-col>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handlePreStepClick">取消</el-button>
                <el-button type="primary" @click="handleNextStepClick">
                    创建知识库
                </el-button>
            </div>
        </template>
</el-dialog> -->
</template>

<script setup lang="ts">
// import { ref } from 'vue'
// import { ElMessage } from 'element-plus'
import router from '@/router'

const handleCreateClick = () => {
    router.push({ name: 'create' })
}

// const dialogVisible = ref(false)
// const knowledgeBaseName = ref('')
// const knowledgeBaseDescription = ref('')
// const knowledgeBaseTag = ref('official')
// const handlePreStepClick = () => {
//     dialogVisible.value = false
// }
// const handleNextStepClick = () => {
//     if (knowledgeBaseName.value.trim() === '') {
//         ElMessage({
//             message: '知识库名称不能为空.',
//             type: 'error',
//         })
//         return
//     }

//     router.push({
//         name: 'create',
//         query: { name: knowledgeBaseName.value },
//     })
// }

</script>

<style scoped lang="scss">
.create-card-wrap {
    ::v-deep .el-card__body {
        padding: 0px !important;
    }
}

.create-card {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 240px;
    height: 240px;
    flex-shrink: 0;
    flex-grow: 1;
    align-items: center;

    .el-card__body {
        height: 100% !important;
    }

    .background {
        height: 40%;
        width: 100%
    }

    .content {
        height: 50%;
        padding: 20px;
        display: flex;
        font-size: 14px;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
    }
}

.dialog-content {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
}
</style>