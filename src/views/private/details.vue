<template>
  <div class="private-details-page">
    <el-container class="container">
      <el-header class="page-header">
        <div class="header-content">
          <div class="header-left">
            <div class="icon">
              <div class="icon-img"></div>
              <!-- <img
                :src="datasetInfo.imageUrl"
                onerror="this.style.display='none'"
                class="icon-img"
              /> -->
            </div>
            <div class="info" v-loading="datasetLoading">
              <div class="knowledge-name">{{ datasetInfo.name }}</div>
              <p class="introduction">{{ datasetInfo.description }}fsffsdfswe;ldjfgle r丰东股份多少个</p>
            </div>
          </div>
          <div class="header-center">
            <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="custom-tabs">
              <el-tab-pane name="document">
                <template #label>
                  <span class="custom-tab-label">
                    <img src="@\assets\document-icon.png" alt="">文档
                  </span>
                </template>
              </el-tab-pane>
              <el-tab-pane name="recall">
                <template #label>
                  <span class="custom-tab-label">
                    <img src="@\assets\recall-icon.png" alt="">召回测试
                  </span>
                </template>
              </el-tab-pane>
              <el-tab-pane name="settings">
                <template #label>
                  <span class="custom-tab-label">
                    <el-icon>
                      <Setting />
                    </el-icon>设置
                  </span>
                </template>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-header>
      <el-main v-if="showDocumentDetail === true" class="page-main">
        <SegementSetting :document="currentDocument" :datasetId="datasetId" :isAdmin="isAdmin"
          @close="showDocumentDetail = false" @update_status="handleUpdateDocumentStatus"
          @rename="handleDocumentRename" />
      </el-main>
      <el-main v-else-if="showSegementSetting === true" class="page-main">
        <DatasetSetting :datasetId="datasetId" v-model:document-setting="documentSettingDetail"
          :datasetInfo="datasetInfo" @close="showSegementSetting = false" @update_status="handleUpdateDocumentStatus"
          @rename="handleDocumentRename" @cancle="showSegementSetting = false" @save="showSegementSetting = false" />
      </el-main>
      <el-main v-else-if="activeTab === 'document'" class="page-main">
        <div class="page-title">
          <h2 class="title">文档</h2>
          <span class="text">知识库的所有文件都在这里显示</span>
        </div>
        <div class="tool">
          <el-input class="input-search" v-model="searchName" size="large" placeholder="搜索" :prefix-icon="Search"
            clearable @input="handleSearch" />
          <el-button type="primary" size="default" @click="handleCreateClick" :disabled="!isAdmin" class="btn-add">
            <el-icon class="btn-icon">
              <plus />
            </el-icon> 添加文件</el-button>
        </div>
        <div class="table">
          <el-table ref="tableRef" :data="documentList" @cell-click="handleDocumentClick"
            @selection-change="handleSelectionChange" :class="{ 'disable-header-selection': !isAdmin }">
            <el-table-column type="selection" width="40" :selectable="() => isAdmin" />
            <el-table-column type="index" label="#" width="40" />
            <el-table-column prop="name" label="名称" min-width="200" max-width="400">
              <template #default="{ row }">
                <file-icon :file="row"></file-icon>
                <span class="name-hover">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="分段模式" width="120">
              <template #default="{ row }">
                <el-button size="default" class="segment-btn" label>
                  <el-icon class="btn-icon">
                    <Setting />
                  </el-icon>{{ ChunkingModeText[row.doc_form as ChunkingMode] }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="word_count" label="字符数" width="100" />
            <el-table-column prop="hit_count" label="召回次数" width="100" />
            <el-table-column prop="created_at" label="上传时间" width="180" sortable :sort-method="sortByUploadTime">
              <template #default="{ row }">
                {{ formatTime(row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <span :class="[
                  'status-dot',
                  row.display_status === 'indexing' ? 'status-indexing' : row.display_status === 'queuing' ? 'status-queuing' :
                    row.display_status === 'error' ? 'status-error' : row.enabled ? 'status-available' : 'status-disabled',
                ]"></span>
                <span>
                  {{ row.display_status === 'indexing' ? '索引中' : row.display_status === 'queuing' ? '排队中' :
                    row.display_status === 'error' ? '错误' : row.enabled ? "可用" : "已禁用" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-switch size="small" :model-value="row.display_status === 'error' ? false : row.enabled"
                  @update:model-value="(newVal) => handleSwitchChange(row, newVal)"
                  :disabled="row.display_status === 'error' || !isAdmin" />
              </template>
            </el-table-column>
            <el-table-column width="55">
              <template #default="{ row }">
                <el-button link class="icon-btn" title="分段设置" @click="handleSegementClick(row)" :disabled="!isAdmin">
                  <img src="@\assets\operation.png" alt="">
                </el-button>
              </template>
            </el-table-column>
            <el-table-column width="55">
              <template #default="scope">
                <el-dropdown>
                  <el-button link class="icon-btn">
                    <el-icon :size="16">
                      <MoreFilled />
                    </el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleRename(scope.row)" :disabled="!isAdmin">重命名</el-dropdown-item>
                      <el-dropdown-item @click="handleDelete(scope.row)" :disabled="!isAdmin">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination layout="total, ->, prev, pager, next" :total="total" v-model:current-page="page"
              v-model:page-size="pageSize" @current-change="handlePageChange" @size-change="handlePageSizeChange">
              <template #total>
                <span class="total-text">共{{total}}项数据</span>
              </template>
            </el-pagination>
          </div>
          <div class="toolbar" v-if="selectedRows.length > 0" ref="toolbarRef">
            <div class="selected">
              <span class="selected-number" disabled>{{ selectedRows.length }}</span>
              <span class="selected-text"> 已选择</span>
            </div>
            <el-button type="default" @click="handleBatchEnable" class="btn">
              <el-icon class="btn-icon">
                <CircleCheck />
              </el-icon>启用
            </el-button>
            <el-button type="default" @click="handleBatchDisable" class="btn">
              <el-icon class="btn-icon">
                <CircleClose />
              </el-icon> 禁用
            </el-button>
            <el-button type="default" @click="handleBatchDelete" class="btn" style="color : #E05F57">
              <el-icon class="btn-icon">
                <Delete />
              </el-icon> 删除
            </el-button>
            <el-button type="default" @click="handleCancelSelection" class="btn btn-cancel">
              取消
            </el-button>
          </div>
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
              <p class="warning-text">
                请确定是否删除所选的知识
              </p>
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
      <el-main v-else-if="activeTab === 'recall'" class="page-main">
        <HitTesting :datasetId="datasetId" :retrieval_model="datasetInfo.retrieval_model_dict" />
      </el-main>
      <el-main v-else-if="activeTab === 'settings'" class="page-main">
        <DocumentSettings :datasetId="datasetId" :isAdmin="isAdmin" :retrieval_model="datasetInfo.retrieval_model_dict"
          @refresh="loadDatasetInfo" />
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onActivated, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox, type TabsPaneContext } from "element-plus";
import { Search,  MoreFilled, CircleCheck, CircleClose, Delete, Setting, Operation, Document as DocumentIcon } from "@element-plus/icons-vue";
import apiService, {
  DocumentList,
} from "@/service/knowledge/use-document-list";
import { Dataset } from "@/models/dataset";
import HitTesting from "@/components/hitTesting.vue";
import DocumentSettings from "@/components/documentSettings.vue";
import SegementSetting from "@/components/documentSegementSetting.vue";
import DatasetSetting from "@/components/datasetSetting/documentSetting.vue";
import {
  getDocumentMetaData,
  patchDocumentStatus,
  postDocumentRename,
  deleteDocument,
} from "@/service/document";
import { Document } from "@/models/document";
import { ChunkingModeText } from '@/models/dataset'
import FileIcon from "@/components/FileItem.vue";
import {debounce} from "lodash";

const route = useRoute();
const router = useRouter();
const activeTab = ref("document");
const dialogFormVisible = ref(false);
const deleteDialogVisible = ref(false);
const currentRow = ref<DocumentList | null>(null);
const newName = ref("");
const queryLoading = ref(false);
const documentList = ref<DocumentList[]>([]);
const datasetId = ref(
  (route.query.id as string) || (route.params.id as string) || ""
);
const datasetLoading = ref(false);

const datasetInfo = ref<Dataset>({
  id: "",
  name: "",
  official: "official",
  imageUrl: "",
  description: "",
  documentNumber: 0,
  characterNumber: 0,
  // 是否有编辑权限
  is_edit: false,
  // 下面这一坨先准备好的话，就不用在这里做初始化了
  retrieval_model_dict: {
    search_method: "semantic_search",
    reranking_enable: false,
    reranking_mode: "reranking_model",
    reranking_model: {
      reranking_provider_name: "",
      reranking_model_name: "",
    },
    weights: {
      weight_type: "customized",
      keyword_setting: {
        keyword_weight: 0,
      },
      vector_setting: {
        vector_weight: 0,
        embedding_model_name: "",
        embedding_provider_name: "",
      },
    },
    top_k: 0,
    score_threshold_enabled: false,
    score_threshold: 0,
  },
});

const showDocumentDetail = ref(false);
const currentDocument = ref<Document>({
  id: "",
  name: "",
  created_at: 0,
  created_by: "",
  extension: "",
  mime_type: "",
  size: 0,
});

// 权限管理
const isAdmin = ref(false)

// 分段设置
const showSegementSetting = ref(false);
const documentSettingDetail = ref<Document | null>(null);

// 分页
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);

const handleTabClick = (tab: TabsPaneContext) => {
  showDocumentDetail.value = false;
  showSegementSetting.value = false;
  activeTab.value = tab.paneName;
};
const handleCreateClick = () => {
  // 跳转到添加文件页面，并传递 datasetId
  router.push({
    path: "/addfiles",
    query: {
      id: datasetId.value,
    },
  });
}

const handleDocumentClick = (
  row: any,
  column: TableColumnCtx<T>,
  cell: HTMLTableCellElement,
  event: Event
) => {
  // console.log(row, column)
  if (column.label === "名称" || column.label === "分段模式") {
    currentDocument.value = row;
    showDocumentDetail.value = true;
  }
};


const handleUpdateDocumentStatus = (docId: string, status: boolean) => {
  patchDocumentStatus(datasetInfo.value.id, status, docId)
    .then(async (res) => {
      ElMessage.success("修改成功");
      // await loadData();
      const targetDoc = documentList.value.find(
        (item) => item.id === currentDocument.value.id
      );
      if (targetDoc) {
        targetDoc.enabled = status;
        targetDoc.display_status = status ? "available" : "disabled";
      }
      currentDocument.value.enabled = status;
      currentDocument.value.display_status = status ? "available" : "disabled";
    })
    .catch((error) => {
      ElMessage.error("修改失败");
    });
};

const handleDocumentRename = (name: string) => {
  postDocumentRename(datasetInfo.value.id, currentDocument.value.id, name)
    .then(async (res) => {
      ElMessage.success("修改成功");
      await loadData();
      const newDocument = documentList.value.find(
        (item) => item.id === currentDocument.value.id
      );
      if (newDocument) {
        currentDocument.value = newDocument;
      }
    })
    .catch((err) => {
      ElMessage.error("修改失败");
    });
};

//可用禁用状态改变
const handleSwitchChange = async (row: DocumentList, currentValue: boolean) => {
  if (row.display_status == 'error') {
    row.enabled = !row.enabled;
    ElMessage.error("修改状态不可用");
  }
  const oldValue = row.enabled;
  try {
    await patchDocumentStatus(datasetInfo.value.id, currentValue, row.id as string);
    ElMessage.success("修改成功");

    const newStatus = currentValue ? "available" : "disabled";
    const targetDoc = documentList.value.find(item => item.id === row.id);
    if (targetDoc) {
      targetDoc.enabled = currentValue;
      targetDoc.display_status = newStatus;
    }

    if (currentDocument.value.id === row.id) {
      currentDocument.value.display_status = newStatus;
      currentDocument.value.enabled = currentValue;
    }

    if (documentSettingDetail.value && documentSettingDetail.value.id === row.id) {
      documentSettingDetail.value.display_status = newStatus;
      documentSettingDetail.value.enabled = currentValue;
    }
  } catch (error: any) {
    ElMessage.error("修改失败");
    row.enabled = oldValue;
    const targetDoc = documentList.value.find(item => item.id === row.id);
    if (targetDoc) {
      targetDoc.enabled = oldValue;
    }
  }
}
const searchName = ref("");

// 获取知识库详情
const loadDatasetInfo = async () => {
  try {
    datasetLoading.value = true;

    const response = await apiService.getDatasetById(datasetId.value);
    datasetInfo.value = response;
    isAdmin.value = response?.is_edit
    // 公共知识库展示只读权限
    if (router.currentRoute.value.fullPath?.toString().match('/public/details')) {
      isAdmin.value = false
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取知识库id等信息失败");
  } finally {
    datasetLoading.value = false;
  }
};
let currentSearchValue = ""; // 记录input中的值
// 增加防抖处理
const debouncedSearch = debounce((val) => {
  loadData(val)
}, 500)
const handleSearch = () => {
  page.value = 1;
  debouncedSearch(searchName.value)

}
const loadData = async (keyword) => {
  try {
    queryLoading.value = true;
    const queryParams = {
      keyword: keyword ? keyword : '',
      limit: pageSize.value,
      page: page.value,
    };

    // 公共知识库使用参数区分
    if (router.currentRoute.value.fullPath?.toString().match('/public/details')) {
      queryParams.sign = 'public'
    }

    const response = await apiService.getDocumentList(
      datasetId.value,
      queryParams
    );

    documentList.value = response.data || response;
    total.value = response.total;
    ElMessage.success("文档列表数据加载完成");
  } catch (error: any) {
    ElMessage.error("文档列表数据加载失败，接口调用错误");
  } finally {
    queryLoading.value = false;
  }
};

const handlePageChange = () => {
  loadData();
}

const handlePageSizeChange = () => {
  loadData();
}

const formatTime = (timestamp: number) => {
  if (!timestamp) return "-";
  const msTimestamp =
    timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  const date = new Date(msTimestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

//按时间排序
const sortByUploadTime = (a: DocumentList, b: DocumentList) => {
  const timeA = new Date(a.created_at).getTime();
  const timeB = new Date(b.created_at).getTime();
  return timeA - timeB;
};
//重命名
const handleRename = (row: DocumentList) => {
  currentRow.value = row;
  newName.value = row.name;
  dialogFormVisible.value = true;
};
const saveRename = async () => {
  if (!newName.value.trim()) {
    ElMessage.warning("名称不能为空");
    return;
  }
  if (!currentRow.value) {
    ElMessage.warning("未选中任何文档");
    return;
  }
  try {
    await postDocumentRename(
      datasetId.value,
      currentRow.value.id,
      newName.value.trim()
    );
    ElMessage.success("修改成功");
    await loadData();
  } catch (error: any) {
    ElMessage.error("修改失败");
  } finally {
    dialogFormVisible.value = false;
  }
};
const handleClose = () => {
  newName.value = "";
  currentRow.value = null;
  dialogFormVisible.value = false;
};
//删除
const handleDelete = (row: DocumentList) => {
  currentRow.value = row;
  deleteDialogVisible.value = true;
};
const confirmDelete = async () => {
  if (!currentRow.value) {
    ElMessage.warning("未选中任何文档");
    return;
  }
  try {
    await deleteDocument(datasetId.value, currentRow.value.id);
    ElMessage.success("删除成功");
    await loadData();
  } catch (error: any) {
    ElMessage.error("删除失败");
  } finally {
    deleteDialogVisible.value = false;
    currentRow.value = null;
  }
};
const handleDeleteClose = () => {
  currentRow.value = null;
  deleteDialogVisible.value = false;
};

// 打开分段设置页面
const handleSegementClick = (row: DocumentList) => {
  getDocumentMetaData(datasetId.value, row.id).then((res) => {
    if (res.dataset_process_rule.rules.segmentation.separator) {
      res.dataset_process_rule.rules.segmentation.separator =
        res.dataset_process_rule.rules.segmentation.separator.replaceAll('\n', '\\n')
    }
    if (res.document_process_rule.rules.segmentation.separator) {
      res.document_process_rule.rules.segmentation.separator =
        res.document_process_rule.rules.segmentation.separator.replaceAll('\n', '\\n')
    }
    documentSettingDetail.value = res;

    if (documentSettingDetail.value.document_process_rule.rules.segmentation?.chunk_overlap == 0) {
      delete documentSettingDetail.value.document_process_rule.rules.segmentation.chunk_overlap
    }
    if (documentSettingDetail.value.document_process_rule.rules.subchunk_segmentation?.chunk_overlap == 0) {
      delete documentSettingDetail.value.document_process_rule.rules.subchunk_segmentation.chunk_overlap
    }
    showSegementSetting.value = true;
  });
}

const selectedRows = ref([]);
const tableRef = ref();
const handleSelectionChange = (rows: DocumentList[]) => {
  selectedRows.value = rows;
};

const handleBatchEnable = async () => {
  try {
    const promises = selectedRows.value
      .filter((row: DocumentList) => row.id)
      .map((row: DocumentList) =>
        patchDocumentStatus(datasetInfo.value.id, true, row.id as string)
      );

    await Promise.all(promises);

    ElMessage.success('启用成功');
    await loadData();
    handleCancelSelection();
  } catch (error: any) {
    ElMessage.error('批量启用失败');
  }
};

const handleBatchDisable = async () => {
  try {
    const promises = selectedRows.value
      .filter((row: DocumentList) => row.id)
      .map((row: DocumentList) =>
        patchDocumentStatus(datasetInfo.value.id, false, row.id as string)
      );

    await Promise.all(promises);
    ElMessage.success('禁用成功');
    await loadData();
    handleCancelSelection();
  } catch (error: any) {
    ElMessage.error('批量禁用失败');
  }
};

const handleBatchDelete = async () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个文档吗？删除后将无法恢复。`,
    '批量删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(async () => {
    try {
      const promises = selectedRows.value
        .filter((row: DocumentList) => row.id)
        .map((row: DocumentList) =>
          deleteDocument(datasetInfo.value.id, row.id as string)
        );

      await Promise.all(promises);
      ElMessage.success('删除成功');
      await loadData();
      handleCancelSelection();
    } catch (error: any) {
      ElMessage.error("批量删除失败");
    }
  }).catch(() => {
  });
};

const handleCancelSelection = () => {
  tableRef.value?.clearSelection();
  selectedRows.value = [];
};


const toolbarRef = ref();
const handleClickOutside = (event: MouseEvent) => {
  const toolbar = toolbarRef.value;
  if (toolbar && selectedRows.value.length > 0 && !toolbar.contains(event.target as Node)) {
    handleCancelSelection();
  }

};

onMounted(() => {
  //检查datasetId
  if (!datasetId.value) {
    ElMessage.warning("缺少知识库ID，请从知识库列表进入");
    return;
  }
  loadDatasetInfo();
  loadData();
  document.addEventListener("click", handleClickOutside);
});

//页面被激活或从其他页面返回时，重新加载数据
onActivated(() => {
  if (datasetId.value) {
    loadData();
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  debouncedSearch.cancel();
});
</script>
<style scoped lang="less">
:deep(.el-pagination){
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.total-text{

}
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
      border-radius: 16px;
      background-color: #ffffff;

      .header-content {
        position: relative;
        display: flex;
        align-items: center;
        padding: 22px 10px;
        .header-left {
          display: flex;
          align-items: center;
          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            // background-color: #b6b9bd;
            flex-shrink: 0;

            .icon-img {
              width: 100%;
              height: 100%;
              background-image: url('@/assets/know-title-icon.png');
              background-size: cover;
              background-position: center;
            }
          }

          .info {
            width: 400px;
            margin-left: 8px;
            .knowledge-name {
              font-size: 18px;
              font-weight: 500;
              color: #000;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .introduction {
              margin: 5px 0 0 0;
              font-size: 12px;
              color: #676F83;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
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
          .custom-tab-label {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          :deep(.custom-tabs) {
            .el-tabs__header {
              background: #fff;
              margin: 0;
            }

            .el-tabs__nav-wrap {
              background: rgba(182, 185, 196, 0.27);
              border-radius: 6px;
              border: none;
              padding: 1px 1px  2px 2px;
              &::after {
                display: none;
              }
            }

            .el-tabs__active-bar {
              display: none;
            }

            .el-tabs__item {
              line-height: 36px;
              font-size: 14px;
              padding: 10px 16px;
              color: #676F83;
              transition: all 0.3s;
              margin: 2px;

              &.is-active {
                background-color: #fff !important;
                color: #000000;
                border-radius: 4px;
              }

              &:hover {
                background: rgba(182, 185, 196, 0.3);
                border-radius: 4px;
              }
            }
          }
        }
      }
    }

    .page-main {
      margin: 16px 0;
      padding: 20px;
      border-radius: 20px;
      background-color: #ffffff;

      .page-title {

        // margin: 15px 0;
        .title {
          font-weight: 700;
          font-size: 16px;
          padding-top: 8px;
        }

        .text {
          display: inline-block;
          font-size: 12px;
          padding-top: 8px;
          color: #676F83;
        }
      }

      .tool {
        padding-top: 23px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
      }

      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
        background: rgba(150, 159, 173, 0.1);
        border-radius: 8px;
      }

      .input-search {
        width: 200px;
        height: 40px;
        border-radius: 8px;
        font-size: 14px;

      }

      .btn-add {
        width: 104px;
        height: 32px;
        border-radius: 8px;
        font-size: 14px;
      }

      .table {
        :deep(.disable-header-selection thead .el-table-column--selection) {
          cursor: not-allowed !important;
        }

        :deep(.disable-header-selection thead .el-table-column--selection .el-checkbox) {
          pointer-events: none;
        }

        :deep(.el-table) {
          .segment-btn {
            height: 22px;
            border-radius: 5px;
            padding: 2px 3px;
            font-size: 12px;
            //&:hover {
            //  background-color: #fff;
            //}
          }

          .status-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: middle;
          }

          .status-text {
            font-size: 14px;
            font-weight: 500;
          }

          .status-indexing {
            background-color: #5169f0;
          }

          .status-queuing {
            background-color: #f87006;
          }

          .status-error {
            background-color: #E05F57;
          }

          .status-available {
            background-color: #59D476;
          }

          .status-disabled {
            background-color: #909399;
          }

          .icon-btn {
            padding: 4px;
            color: #606266;

            &:hover {
              color: #5169f0;
            }
          }

          .name-hover {
            cursor: pointer;
          }
        }

        .toolbar {
          display: flex;
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translate(-50%, 0%);
          border: 1px solid #5169F0;
          border-radius: 8px;
          background: #F9FBFF;
          align-items: center;
          padding: 5px;
          z-index: 101;
          box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.2);

          .selected {
            display: inline-block;
            align-items: center;
            padding: 0 10px;
            border-right: 1px solid #DCDCDC;
            font-size: 14px;
          }

          .selected-number {
            padding: 2px 6px;
            border-radius: 5px;
            color: #fff;
            background-color: #5169f0;
          }

          .selected-text {
            color: #606266;
            font-weight: 700;
            padding-left: 5px;
            color: #5169f0;
          }

          .btn {
            padding: 10px;
            background: #F9FBFF;
            border: 0px;
            border-radius: 0px;
            font-weight: bold;
          }

          .btn-cancel {
            border-left: 1px solid #DCDCDC;
            height: 14px;
            padding: 0 15px;
          }
        }
      }

      :deep(.el-switch.is-checked .el-switch__core) {
        background-color: #5169F0;
        border-color: #5169F0;
      }
    }
  }
}

.btn-icon {
  margin-right: 5px;
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
