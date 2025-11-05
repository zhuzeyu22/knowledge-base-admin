<template>
    <el-card class="create-card-wrap">
        <div class="create-card">
            <div class='create-card-background'></div> 
            <div class="content">
                <div class="description">导入您自己的文本数据，支持包括但不限于PDF、Word、csv等主流文档格式。</div>
                <el-button type="primary" plain @click="handleCreateClick">创建知识库</el-button>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import router from '@/router'

const handleCreateClick = () => {
    router.push({ name: 'create' })
}

</script>

<style scoped lang="scss">
.create-card-wrap {
    ::v-deep .el-card__body {
        padding: 0px !important;
    }
}
.create-card-background{
    background-image: url('@/assets/know-background.png');
    width: 100%;
    height: 60%;
    background-size: cover;
    background-position: center;
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