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
            <el-main class="page-main">
                <div class="tool">
                    <el-input style="width: 240px" size="large" placeholder="搜索内容" :prefix-icon="Search" />
                    <el-button type="primary" size="default">添加文件</el-button>
                </div>
                <div class="table">
                    <el-table :data="getMockData" >
                        <el-table-column type="selection" width="40" />
                        <el-table-column prop="id" label="" width="20" />
                        <el-table-column prop="name" label="名称" min-width="200" />
                        <el-table-column label="分段模式" width="120">
                            <template #default>
                                <el-button size="small" class="segment-btn">通用</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="charCount" label="字符数" width="100" />
                        <el-table-column prop="recallCount" label="召回次数" width="100" />
                        <el-table-column prop="uploadTime" label="上传时间" width="180" />
                        <el-table-column label="状态" width="100">
                            <template #default="{ row }">
                                <span :class="['status-text', row.enabled ? 'status-available' : 'status-disabled']">
                                    {{ row.enabled ? '可用' : '已禁用' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80">
                            <template #default="{ row }">
                                <el-switch v-model="row.enabled" />
                            </template>
                        </el-table-column>
                        <el-table-column width="50">
                            <template #default>
                                <el-button link class="icon-btn">
                                    <el-icon :size="16"><List /></el-icon>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column width="50">
                            <template #default>
                                <el-dropdown>
                                    <el-button link class="icon-btn">
                                        <el-icon :size="16"><MoreFilled /></el-icon>
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item>重命名</el-dropdown-item>
                                            <el-dropdown-item>删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { Search, List, MoreFilled } from '@element-plus/icons-vue'

const activeTab = ref('document')

const handleTabClick = (tab: TabsPaneContext) => {
    console.log('切换到:', tab.paneName)
}

const getMockData = ref([
    {
        id: 1,
        name: '产品技术白皮书.pdf',
        segmentMode: '通用',
        charCount: '15.2k',
        recallCount: 5,
        uploadTime: '2024-10-15 14:30:25',
        enabled: true,
    },
    {
        id: 2,
        name: '用户操作手册.docx',
        segmentMode: '通用',
        charCount: '28.6k',
        recallCount: 8,
        uploadTime: '2024-10-14 09:15:42',
        enabled: true,
    },
    {
        id: 3,
        name: 'API接口文档.md',
        segmentMode: '通用',
        charCount: '42.1k',
        recallCount: 3,
        uploadTime: '2024-10-13 16:48:09',
        enabled: false,
    },
    {
        id: 4,
        name: '系统架构设计.pdf',
        segmentMode: '通用',
        charCount: '56.7k',
        recallCount: 2,
        uploadTime: '2024-10-12 11:22:33',
        enabled: true,
    },
])
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
                            background-color: #E2E5EB;
                            border: none;
                            padding: 1px;
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
                            font-size: 12px;
                            color: #606266;
                            transition: all 0.3s;
                            border-right: 1px solid #000;

                            &:last-child {
                                border-right: none;
                            }

                            &.is-active {
                                position: relative;
                                background-color: #fff;
                                border: 1px solid #000;
                                z-index: 1;
                            }
                            &.is-active:not(:first-child) {
                                margin-left: -1px;
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
            padding: 20px;
            border-radius: 20px;
            background-color: #ffffff;

            .tool {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .table {
                :deep(.el-table) {
                    .segment-btn {
                        background-color: #E2E5EB;
                        border: none;
                        border-radius: 0px;
                        &:hover {
                            background-color: #fff;
                        }
                    }

                    .status-text {
                        font-size: 14px;
                        font-weight: 500;
                    }

                    .status-available {
                        color: #67c23a;
                    }

                    .status-disabled {
                        color: #909399;
                    }

                    .icon-btn {
                        padding: 4px;
                        color: #606266;
                        &:hover {
                            color: #409eff;
                        }
                    }
                }
            }
        }
    }
}
</style>