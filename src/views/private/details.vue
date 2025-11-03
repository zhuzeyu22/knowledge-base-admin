<template>
    <div class="private-details-page">
        <el-container class="container">
            <el-header class="page-header">
                <div class="header-content">
                    <div class="header-left">
                        <div class="icon">
                            <img :src="datasetInfo.imageUrl" onerror="this.style.display='none'"  class="icon-img" />
                        </div>
                        <div class="info" v-loading="datasetLoading">
                            <h3>{{ datasetInfo.name }}</h3>
                            <p class="introduction">{{ datasetInfo.description }}</p>
                        </div>
                    </div>
                    <div class="header-center">
                        <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="custom-tabs">
                            <el-tab-pane label="文档" name="document"></el-tab-pane>
                            <el-tab-pane label="召回测试" name="recall">
                            </el-tab-pane>
                            <el-tab-pane label="设置" name="settings"></el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </el-header>
            <el-main v-if="activeTab === 'document' && shouDocumentDetail === false" class="page-main">
                <div class="tool">
                    <el-input style="width: 240px" v-model="searchName" size="large" placeholder="搜索文档名称"
                        :prefix-icon="Search" clearable @clear="onClearSearch" @input="loadData" />
                    <el-button type="primary" size="default" @click="handleCreateClick">添加文件</el-button>
                </div>
                <div class="table">
                    <el-table :data="documentList" @cell-click="handleDocumentClick">
                        <el-table-column type="selection" width="40" />
                        <el-table-column type="index" label="" width="20" />
                        <el-table-column prop="name" label="名称" min-width="200" />
                        <el-table-column label="分段模式" width="120">
                            <template #default>
                                <el-button size="small" class="segment-btn">通用</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="word_count" label="字符数" width="100" />
                        <el-table-column prop="hit_count" label="召回次数" width="100" />
                        <el-table-column prop="created_at" label="上传时间" width="180" sortable
                            :sort-method="sortByUploadTime" >
                            <template #default="{ row }">
                                {{ formatTime(row.created_at) }}
                            </template>
                        </el-table-column>
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
                            <template #default="scope">
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
                    <el-dialog title="确定删除吗？" v-model="deleteDialogVisible" :before-close="handleDeleteClose"
                        width="400px">
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
            <el-main v-else-if="activeTab === 'document' && shouDocumentDetail === true" class="page-main">
                <SegementSetting :document='currentDocument' :datasetId='datasetId' @close='shouDocumentDetail = false' @update_status='handleUpdateDocumentStatus' @rename='handleDocumentRename' />
            </el-main>
            <el-main v-else-if="activeTab === 'recall'" class="page-main">
                <HitTesting :datasetId='datasetId' :retrieval_model="datasetInfo.retrieval_model_dict" />
            </el-main>
            <el-main v-else-if="activeTab === 'settings'" class="page-main">
                <DocumentSettings :datasetId='datasetId' :retrieval_model="datasetInfo.retrieval_model_dict" @refresh="loadDatasetInfo" />
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type TabsPaneContext } from 'element-plus'
import { Search, List, MoreFilled } from '@element-plus/icons-vue'
import apiService, { DocumentList } from '@/service/knowledge/use-document-list'
import { Dataset } from '@/models/dataset';
import HitTesting from '@/components/hitTesting.vue';
import DocumentSettings from '@/components/documentSettings.vue';
import SegementSetting from "@/components/documentSegementSetting.vue";
import { patchDocumentStatus, postDocumentRename } from '@/service/document'
import { Document } from '@/models/document';

const route = useRoute()
const router = useRouter()
const activeTab = ref('document')
const dialogFormVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentRow = ref<DocumentList | null>(null)
const newName = ref('')
const queryLoading = ref(false)
const documentList = ref<DocumentList[]>([])
const datasetId = ref((route.query.id as string) || (route.params.id as string) || '')
const datasetLoading = ref(false)

const datasetInfo = ref<Dataset>({
    id: '',
    name: '',
    isOfficial: false,
    imageUrl: '',
    description: '',
    documentNumber: 0,
    characterNumber: 0,
    // 下面这一坨先准备好的话，就不用在这里做初始化了
    retrieval_model_dict: {
        search_method: 'semantic_search',
        reranking_enable: false,
        reranking_mode: 'reranking_model',
        reranking_model: {
            reranking_provider_name: '',
            reranking_model_name: ''
        },
        weights: {
            weight_type: 'customized',
            keyword_setting: {
                keyword_weight: 0
            },
            vector_setting: {
                vector_weight: 0,
                embedding_model_name: '',
                embedding_provider_name: ''
            }
        },
        top_k: 0,
        score_threshold_enabled: false,
        score_threshold: 0
    }
})

const shouDocumentDetail = ref(false)
const currentDocument = ref<Document>({
  id: '',
  name: '',
  created_at: 0,
  created_by: '',
  extension: '',
  mime_type: '',
  size: 0
})

const handleTabClick = (tab: TabsPaneContext) => {
    activeTab.value = tab.paneName
    console.log('切换到:', tab.paneName)
}
const handleCreateClick = () => {
    router.push({ name: 'create' })
}
                                                                                                                                                                
const handleDocumentClick = (row: any, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: Event) => { 
    // console.log(row, column)
    if(column.label === '名称'){
        currentDocument.value = row
        shouDocumentDetail.value = true
    }
}

const handleUpdateDocumentStatus = (status: boolean)=>{
    patchDocumentStatus(datasetInfo.value.id, status, currentDocument.value.id).then(async res=>{
        ElMessage.success('修改成功')
        await loadData()
        const newDocument = documentList.value.find(item=>item.id === currentDocument.value.id)
        if(newDocument){
            currentDocument.value = newDocument
        }
    }).catch(err=>{
        ElMessage.error('修改失败')
    })
}

const handleDocumentRename = (name: string) => { 
    postDocumentRename(datasetInfo.value.id, currentDocument.value.id, name).then(async res=>{
        ElMessage.success('修改成功')
        await loadData()
        const newDocument = documentList.value.find(item=>item.id === currentDocument.value.id)
        if(newDocument){
            currentDocument.value = newDocument
        }
    }).catch(err=>{
        ElMessage.error('修改失败')
    })
}

const searchName = ref('')

// 获取知识库详情
const loadDatasetInfo = async () => {
    try {
        datasetLoading.value = true

        const response = await apiService.getDatasetById(datasetId.value)
        datasetInfo.value = response

        ElMessage.success('获取知识库id等信息成功')
    } catch (error: any) {
        ElMessage.error(error.message || '获取知识库id等信息失败')
    } finally {
        datasetLoading.value = false
    }
}

const loadData = async () => {
    try {
        queryLoading.value = true
        const queryParams = {
            keyword: searchName.value
        }
        const response = await apiService.getDocumentList(datasetId.value, queryParams)

        documentList.value = response.data || response
        ElMessage.success('文档列表数据加载完成')
    } catch (error: any) {
        ElMessage.error('文档列表数据加载失败，接口调用错误')
    } finally {
        queryLoading.value = false
    }
}
const formatTime = (timestamp:number) => {
    if (!timestamp) return '-'
    const msTimestamp = timestamp.toString().length === 10 ? timestamp * 1000  : timestamp
    const date = new Date(msTimestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}`
}
//清空搜索
const onClearSearch = () => {
    searchName.value = ''
    loadData()
}
//按时间排序
const sortByUploadTime = (a: DocumentList, b: DocumentList) => {
    const timeA = new Date(a.created_at).getTime()
    const timeB = new Date(b.created_at).getTime()
    return timeA - timeB
}
//重命名
const handleRename = (row: DocumentList) => {
    currentRow.value = row;
    newName.value = row.name;
    dialogFormVisible.value = true;
}
const saveRename = () => {
    if (!newName.value.trim()) {
        ElMessage.warning('名称不能为空')
        return
    }
    if (currentRow.value) {
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
const handleDelete = (row: DocumentList) => {
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
        return
    }
    loadDatasetInfo()
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
                position: relative;
                display: flex;
                align-items: center;
                min-height: 60px;
                padding-right: 20px;

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    max-width: calc(50% - 150px);
                    min-width: 0;

                    .icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 60px;
                        height: 60px;
                        border-radius: 12px;
                        background-color: #b6b9bd;
                        flex-shrink: 0;

                        .icon-img {
                            width: 100%;
                            height: 100%;
                            border-radius: 12px;
                            object-fit: cover;
                        }
                    }

                    .info {
                        flex: 1;
                        min-width: 0;
                        overflow: hidden;

                        h3 {
                            margin: 0;
                            font-weight: 700;
                            font-size: 20px;
                            color: #303133;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .introduction {
                            margin: 5px 0 0 0;
                            font-size: 14px;
                            color: #909399;
                            word-wrap: break-word;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }

                .header-center {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    justify-content: center;

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