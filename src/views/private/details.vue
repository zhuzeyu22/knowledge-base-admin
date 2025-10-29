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
                    <el-input style="width: 240px" v-model="searchName" size="large" placeholder="搜索文档名称"
                        :prefix-icon="Search" clearable @clear="onClearSearch" @keyup.enter="loadData" />
                    <el-button type="primary" size="default">添加文件</el-button>
                </div>
                <div class="table">
                    <el-table :data="documentList" >
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
                        <el-table-column prop="uploadTime" label="上传时间" width="180" sortable
                            :sort-method="sortByUploadTime" />
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
                                <el-button link class="icon-btn" title="分段设置">
                                    <el-icon :size="16">
                                        <List />
                                    </el-icon>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column width="50">
                            <template #default = "scope">
                                <el-dropdown>
                                    <el-button link class="icon-btn">
                                        <el-icon :size="16">
                                            <MoreFilled />
                                        </el-icon>
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="handleRename(scope.row)">重命名</el-dropdown-item>
                                            <el-dropdown-item @click="handleDelete(scope.row)">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-dialog title="重命名" v-model="dialogFormVisible" :before-close="handleClose" width="400px">
                        <el-input v-model="newName" placeholder="请输入新名称" clearable></el-input>
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取消</el-button>
                                <el-button type="primary" @click="saveRename">保存</el-button>
                            </div>
                        </template>
                    </el-dialog>
                    <el-dialog title="确定删除吗？" v-model="deleteDialogVisible" :before-close="handleDeleteClose" width="400px">
                        <div class="delete-content">
                            <p class="warning-text">如果您需要稍后恢复处理，您将从您离开的地方继续</p>
                        </div>
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="deleteDialogVisible = false">取消</el-button>
                                <el-button type="danger" @click="confirmDelete">确定删除</el-button>
                            </div>
                        </template>
                    </el-dialog>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, type TabsPaneContext } from 'element-plus'
import { Search, List, MoreFilled } from '@element-plus/icons-vue'
import apiService from '../../service/knowledge/use-document-list'

const route = useRoute()
const activeTab = ref('document')
const dialogFormVisible = ref(false)
const deleteDialogVisible = ref(false)
interface RowRename {
  id: number;
  name: string;
  segmentMode: string;
  charCount: string;
  recallCount: number;
  uploadTime: string;
  enabled: boolean;
}
const currentRow = ref<RowRename | null>(null)
const newName = ref('')
const queryLoading = ref(false)
const documentList = ref<any[]>([])
const datasetId = ref((route.query.id as string) || (route.params.id as string) || '')

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
        uploadTime: '2024-10-12 11:22:33',
        enabled: false,
    },
    {
        id: 4,
        name: '系统架构设计.pdf',
        segmentMode: '通用',
        charCount: '56.7k',
        recallCount: 2,
        uploadTime: '2024-10-13 16:48:09',
        enabled: true,
    },
])

const searchName = ref('')

const loadData = async () => {
    try {
        queryLoading.value = true
        const queryParams = {
            keyword: searchName.value
        }
        const response = await apiService.getDocumentList(datasetId.value, queryParams)
        
        documentList.value = response.data
        
        ElMessage.success('数据加载完成')
        
    } catch (error: any) {
        ElMessage.error(error.message || '使用模拟数据')
        documentList.value = getMockData.value
    } finally {
        queryLoading.value = false
    }
} 

//清空搜索
const onClearSearch = () => {
    searchName.value = ''
    loadData()
}
//按时间排序
const sortByUploadTime = (a: any, b: any) => {
    const timeA = new Date(a.uploadTime).getTime()
    const timeB = new Date(b.uploadTime).getTime()
    return timeA - timeB
}
//重命名
const handleRename = (row: RowRename) => {
    currentRow.value = row;
    newName.value = row.name;
    dialogFormVisible.value = true;
}
const saveRename = () => {
    if(!newName.value.trim()){
        ElMessage.warning('名称不能为空')
        return 
    }
    if(currentRow.value){
        currentRow.value.name = newName.value.trim();
    }
    ElMessage.success('修改成功')
    dialogFormVisible.value = false;
}
const handleClose = () => {
    newName.value = '';
    currentRow.value = null;
    dialogFormVisible.value = false;
}
//删除
const handleDelete = (row: RowRename) => {
    currentRow.value = row;
    deleteDialogVisible.value = true;
}
const confirmDelete = () => {
    if (currentRow.value) {
        const index = documentList.value.findIndex(item => item.id === currentRow.value!.id)
        if (index !== -1) {
            documentList.value.splice(index, 1)
            ElMessage.success('删除成功')
        }
    }
    deleteDialogVisible.value = false;
    currentRow.value = null;
}
const handleDeleteClose = () => {
    currentRow.value = null;
    deleteDialogVisible.value = false;
}

onMounted(() => {
    //检查datasetId
    if (!datasetId.value) {
        ElMessage.warning('缺少知识库ID，请从知识库列表进入')
        documentList.value = getMockData.value
        return
    }
    loadData()
})
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

.delete-content {
    padding: 10px 0;

    p {
        margin: 10px 0;
        font-size: 14px;
        color: #606266;
        line-height: 1.6;
    }

    .highlight-name {
        font-weight: 600;
        color: #303133;
    }

    .warning-text {
        color: #606266;
        font-size: 15px;
    }
}
</style>