<template>
    <el-card class="create-card-wrap">
        <div class="create-card">
            <div class='create-card-background'></div>
            <div class="create-card-icon">
                <img src="@/assets/create-img.png" alt="" @click="handleCreateClick">
            </div>
            <div class="content">
                <div class="description">导入您自己的文本数据，支持包括但不限于PDF、Word、csv等主流文档格式。</div>
                <el-button class="button" @click="handleCreateClick" text bg>
                    <img src="@/assets/create-icon.png" alt="" class="button-icon">创建知识库</el-button>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
// import router from '@/router'
const emit = defineEmits(["create"]);

const handleCreateClick = () => {
    emit("create");
    // router.push({ name: 'create' })
}

</script>

<style scoped lang="scss">
.create-card-wrap {
    ::v-deep .el-card__body {
        padding: 0px !important;
    }
}

.create-card-background {
    position: relative;
    background-image: url('@/assets/know-background.png');
    width: 100%;
    height: 60%;
    background-size: cover;
    background-position: center;
}

.create-card-icon {
    position: absolute;
    left: 10px;
    bottom: 120px;
    cursor: pointer;
}

.create-card {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 280px;
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
        padding: 20px 20px 0;
        display: flex;
        font-size: 14px;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;

        .description{
            line-height: 18px;
        }
        .button {
            margin-bottom: 10px;
            height: 40px;
            color: #000;

            .button-icon {
                padding-right: 5px;
            }
        }
    }
}

.dialog-content {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
}
</style>