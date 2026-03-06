<template>
  <el-header class="header-style">
    <div class="header-left">
      <div @click="handleClose" class="back-wrapper can-click">
        <el-icon class="back-icon">
          <ArrowLeftBold />
        </el-icon>
      </div>
      <div>
        <div>{{ document.name }}</div>
      </div>
    </div>
    <div class="header-right">
      <el-button class="add-segment-btn" size="small" @click="handleCreateSegementClick" :disabled="!isAdmin">
        <el-icon style="margin-right: 6px;"><Plus /></el-icon>
        添加分段
      </el-button>
      <!-- 同步有问题，暂时注释掉 -->
      <!-- <div>{{ document.display_status === 'error' ? "错误" : display_status ? "可用" : "已禁用" }}
      </div>
      <el-switch :model_value="document.display_status === 'error' ? false : display_status" @change="handleChange"
        :disabled="document.display_status === 'error'" /> -->
      <!-- <el-button>分段设置</el-button> -->
      <el-dropdown trigger="click" placement="bottom-end">
        <el-icon style="cursor: pointer">
          <MoreFilled />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showRenameModel = true" :disabled="!isAdmin">重命名</el-dropdown-item>
            <el-dropdown-item divided @click="handleDeleteClick" :disabled="!isAdmin">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
  <div>
    <el-row>
      <el-col class="left-col" :span="12">
        <el-table :data="segementList" @selection-change="handleSelectionChange"
          :class="{ 'disable-header-selection': !isAdmin }">
          <el-table-column class="check-row" type="selection" width="30" :selectable="() => isAdmin" />
          <el-table-column :label="`${total} 分段`">
            <template #default="scope">
              <div class="segment-header">
              <div class="segment-info">
                <img
                    src="@/assets/dataset-setting/segement-icon.png"
                    class="delete-icon"
                    width="14"
                    height="14"
                    @click="handleDeleteSegement(scope.row)"
                    :class="{ 'disabled': !isAdmin }"
                />
                <span>分段 {{ scope.row.position }}</span>
                <span>{{ scope.row.word_count }} 字符&nbsp;·&nbsp; {{ scope.row.hit_count }}&nbsp;召回次数</span>

              </div>
              <div class="segment-actions">
                <span>{{ scope.row.status == "completed" ? "已启用" : "已禁用" }}</span>
                <span
                    class="status-dot"
                    :class="scope.row.status == 'completed' ? 'enabled' : 'disabled'"
                ></span>
                <el-dropdown trigger="click" placement="bottom-end">
                  <el-icon style="cursor: pointer">
                    <MoreFilled />
                  </el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleUpdateSegementClick(scope.row)"
                                        :disabled="!isAdmin">编辑</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
              <el-row v-if="document.doc_form == 'text_model'">
                {{ scope.row.content }}
              </el-row>
              <div class="chunk-li" v-if="document.doc_form == 'qa_model'">
               <div style="color: #000; padding-bottom: 6px"><span class="q-icon qa-icon">问</span> {{ scope.row.content }}</div>
                <div style="color: #000">
                  <span class="a-icon qa-icon">答</span>
                  {{ scope.row.answer }}
                </div>
              </div>
              <el-row v-if="document.doc_form == 'hierarchical_model'">
                {{ scope.row.content }}
              </el-row>
              <el-row>
                <el-tag v-for="value in scope.row.keywords">{{ value }}</el-tag>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="page" v-model:page-size="limit"
          @change="handlePageChange" />
      </el-col>
      <el-col class="right-col" :span="12">
        <div class="document message">
          <h3 class="message-title">文档信息</h3>
          <el-form>
            <el-form-item label="原始文件名称">{{ document.name }}</el-form-item>
            <el-form-item label="原始文件大小">{{ document.size }}</el-form-item>
            <el-form-item label="上传日期">{{ document.created_at }}</el-form-item>
            <el-form-item label="最后更新日期">{{ document.updated_at }}</el-form-item>
            <el-form-item label="来源">{{ document.data_source_type }}</el-form-item>
          </el-form>
          <h3 class="message-title">技术参数</h3>
          <el-form>
            <el-form-item label="分段规则">{{ ChunkingModeText[document.doc_form as ChunkingMode] }}</el-form-item>
            <el-form-item label="段落长度">{{ document.max_tokens }}</el-form-item>
            <el-form-item label="平均段落长度">{{ document.average_segment_length }} characters</el-form-item>
            <el-form-item label="段落数量">{{ document.segment_count }} paragraphs</el-form-item>
            <el-form-item label="召回次数">
              {{ document.recall_count }}
              {{ document.hit_count }}/{{ document.segment_count }}
            </el-form-item>
            <el-form-item label="嵌入时间">{{ document.indexing_latency }} sec</el-form-item>
            <el-form-item label="嵌入花费">{{ document.tokens }} tokens</el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>

  <el-dialog v-model="showRenameModel" title="重命名" width="800">
    <div>重命名</div>
    <el-input v-model="rename"></el-input>
    <div class="dialog-footer">
      <el-button type="primary" @click="handleRenameEnsure">确定 </el-button>
      <el-button @click="showRenameModel = false">取消</el-button>
    </div>
  </el-dialog>

  <UpdateSegement v-model="showUpdateSegementModel" :segement="newSegement" :documentId="document.id"
    :datasetId="datasetId" :docForm="document.doc_form" @update_data="handleUpdateData" />

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { ArrowLeftBold, MoreFilled, Plus} from "@element-plus/icons-vue";
import { getSegmentList, deleteSegment } from "@/service/segement";
import { ElMessage, ElMessageBox } from "element-plus";
import UpdateSegement from "@/components/updateSegement.vue";
import { deleteDocument, getDocumentMetaData } from "@/service/document";
import { formatTimestamp } from "@/utils/time";
import { DataSourceType, DataSourceTypeText, ProcessMode, ProcessModeText } from "@/models/dataset";
import { ChunkingModeText } from '@/models/dataset'

const { document, datasetId, isAdmin } = defineProps(["document", "datasetId", "isAdmin"]);
const emit = defineEmits(["close", "update_status", "rename"]);
const showRenameModel = ref(false);
const rename = ref(document.name);
const segementList = ref([]);
const limit = ref(10);
const page = ref(1);
const total = ref(0);

// 分段编辑
const showUpdateSegementModel = ref(false);
const newSegement = ref(null);

const display_status = computed(() => {
  return document.display_status == "available";
});

const handleClose = () => {
  emit("close");
};
const handleChange = (status) => {
  emit("update_status", document.id.status);
};

const handleRenameEnsure = () => {
  emit("rename", rename.value);
  showRenameModel.value = false;
};

const handleDeleteClick = async () => {
  ElMessageBox.confirm("删除这个文档？", "", {
    confirmButtonText: "我确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteDocument(datasetId, document.id).then(() => {
      ElMessage.success("删除成功");
      location.reload()
    }).catch(error => {
      ElMessage.error("删除失败");
    })
  })
};


// 段落编辑
const handleSelectionChange = (rows: any) => {
};

const updateData = () => {
  getSegmentList(datasetId, document.id, page.value, limit.value).then(
    (res) => {
      segementList.value = res.data;
      console.log('表格数据',segementList.value)
      limit.value = res.limit | 0;
      page.value = res.page | 0;
      total.value = res.total | 0;
    }
  );
};

const handlePageChange = (currentPage: number, pageSize: number) => {
  updateData();
};

const handleDeleteSegement = (row) => {
  ElMessageBox.confirm("删除这个分段？", "", {
    confirmButtonText: "我确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteSegment(datasetId, document.id, row.id).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        updateData();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};

//文档信息和技术参数
const documentMessage = async () => {
  try {
    const res = await getDocumentMetaData(datasetId, document.id)
    document.size = isNaN(res.data_source_info.upload_file.size) ? '未知' : (Number(res.data_source_info.upload_file.size) / 1024).toFixed(2) + 'KB'
    document.created_at = formatTimestamp(res.created_at)
    document.updated_at = formatTimestamp(res.updated_at)
    document.data_source_type = DataSourceTypeText[res.data_source_type as DataSourceType]
    document.dataset_process_rule = ProcessModeText[res.dataset_process_rule.mode as ProcessMode]
    document.max_tokens = res.dataset_process_rule.rules.segmentation.max_tokens
    document.average_segment_length = res.average_segment_length
    document.segment_count = res.segment_count
    document.recall_count = Number(Number(res.hit_countres) / Number(res.segment_count)).toFixed(2)
    document.indexing_latency = isNaN(res.indexing_latency) ? '未知' : Number(res.indexing_latency).toFixed(2)
    if (res.tokens !== null && res.tokens !== undefined) {
      document.tokens = res.tokens.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    else {
      document.tokens = '0'
    }
  }
  catch (error) {
    ElMessage.error(`文档信息展示错误：${error.message}`)
  }
}

const handleUpdateData = () => {
  updateData();
};

onMounted(() => {
  console.log('看看document',document)
  updateData();
  documentMessage()

});

// 分段编辑相关
const handleCreateSegementClick = () => {
  newSegement.value = null;
  showUpdateSegementModel.value = true;
};

const handleUpdateSegementClick = (row) => {
  newSegement.value = row;
  showUpdateSegementModel.value = true;
};

</script>

<style lang="less" scoped>
.header-style {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dialog-footer {
  display: flex;
  flex-direction: row-reverse;
  gap: 16px;
  margin-top: 16px;
}

.message-title {
  padding: 20px 0;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

:deep(.disable-header-selection thead .el-table-column--selection) {
  cursor: not-allowed !important;
}

:deep(.disable-header-selection thead .el-table-column--selection .el-checkbox) {
  pointer-events: none;
}

:deep(.el-form-item--label-right .el-form-item__label) {
  justify-content: flex-start;
}
:deep(.document .el-form) {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-form-item__label {
    text-align: left;
    width: 100px ;
    color: #455166 !important;
    font-size: 14px;
    line-height: 1.2;
    height:18px;
  }

  .el-form-item__content {
    color: #000;
    font-size: 14px;
    line-height: 1.2;
    display: block;
    height: 18px;
  }
}
.left-col{
  padding-right: 20px;
}
.right-col {
  border-left: 1px solid #e4e7ed;
  padding-left: 20px;
}
.add-segment-btn {
  border-radius: 4px;
  color: var(--el-color-primary);
  //border-color: var(--el-color-primary);

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    background-color: rgba(81, 105, 240, 0.1);
  }

  &:disabled {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    opacity: 0.5;
  }
}
.back-icon {
  font-size: 14px;
  font-weight: bold;
}

.back-text {
  font-size: 14px;
  margin-left: 4px;
}

.back-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
}
.qa-icon{
  display: inline-block;
  padding: 2px;
  font-size: 12px;
  line-height: 1.2;
  margin-right: 3px;
}
.q-icon{
  color: #f06851;
  background: #FFEDE9;
}
.a-icon{
  background: #E9F2FF;
  color: #5169F0;
}
.segment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.segment-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #676F83;
}

.segment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.delete-icon {
  cursor: pointer;
  margin-right: 12px;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;

  &.enabled {
    background-color: #59D476;
  }

  &.disabled {
    background-color: #F46C6C;
  }
}
:deep(.el-table .el-table__body-wrapper .el-table__body tr td:first-child) {
  vertical-align: top;
}
</style>
