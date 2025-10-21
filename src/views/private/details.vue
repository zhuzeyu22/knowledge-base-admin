<template>
    <div class="private-details-page">
        <el-container class="container">
            <el-header class="page-header">
                <div class="header-content">
                    <div class="header-left">
                        <div class="icon">
                            <img src="" alt="知识库图标" class="icon-img" />
                        </div>
                        <div class="info">
                            <h3>知识库名称</h3>
                            <p class="introduction">知识库简介</p>
                        </div>
                    </div>
                    <div class="header-center">
                        <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="custom-tabs">
                            <el-tab-pane label="文档" name="document"></el-tab-pane>
                            <el-tab-pane label="召回测试" name="recall"></el-tab-pane>
                            <el-tab-pane label="设置" name="settings"></el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </el-header>
            <el-main class="page-main ">
                hello
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeTab = ref('document')

const handleTabClick = (tab: TabsPaneContext) => {
    console.log('切换到:', tab.paneName)
}
</script>
<style scoped lang="less">
.private-details-page {
    width: 100%;

    .container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 40px);

        .page-header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: auto;
            min-height: 100px;
            padding: 20px;
            border-radius: 20px;
            background-color: #ffffff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

            .header-content {
                display: flex;
                position: relative;
                align-items: center;
                gap: 40px;

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 60px;
                        height: 60px;
                        border-radius: 12px;
                        background-color: #409eff;
                        flex-shrink: 0;
                        .icon-img {
                            width: 100%;
                            height: 100%;
                            border-radius: 12px;
                            object-fit: cover;
                        }
                    }

                    .info {
                        h3 {
                            margin: 0;
                            font-weight: 700;
                            font-size: 20px;
                            color: #303133;
                        }

                        .introduction {
                            margin: 5px 0 0 0;
                            font-size: 14px;
                            color: #909399;
                        }
                    }
                }

                .header-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -20px;
                    margin-left: -130px;
                    :deep(.custom-tabs) {
                        .el-tabs__header {
                            padding: 3px;
                            background-color: #f5f7fa;
                            border-radius: 8px;
                        }

                        .el-tabs__nav-wrap {
                            &::after {
                                display: none;
                            }
                        }

                        .el-tabs__active-bar {
                            display: none;
                        }

                        .el-tabs__item {
                            padding: 0 20px;
                            height: 36px;
                            line-height: 36px;
                            font-size: 14px;
                            color: #606266;
                            border-radius: 4px;
                            transition: all 0.3s;

                            &.is-active {
                                background-color: #fff;
                                color: #303133;
                                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
                            }

                            &:hover {
                                color: #409eff;
                            }
                        }
                    }
                }
            }
        }

        .page-main {
            margin: 20px 0;
            border-radius: 20px;
            background-color: #ffffff;
        }
    }
}
</style>