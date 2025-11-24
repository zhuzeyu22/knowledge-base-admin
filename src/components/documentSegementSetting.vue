<template>
  <el-header class="header-style">
    <div class="header-left">
      <el-button
        type="primary"
        link
        size="default"
        @click="handleClose"
        style="padding: 0; margin-right: 16px"
      >
        <el-icon>
          <Back />
        </el-icon>
      </el-button>
      <div>
        <div>{{ document.name }}</div>
      </div>
    </div>
    <div class="header-right">
      <el-button @click="handleCreateSegementClick">添加分段</el-button>
      <div>{{ display_status ? "可用" : "已禁用" }}</div>
      <el-switch v-model="display_status" @change="handleChange" />
      <!-- <el-button>分段设置</el-button> -->
      <el-dropdown trigger="click" placement="bottom-end">
        <el-icon style="cursor: pointer">
          <MoreFilled />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showRenameModel = true"
              >重命名</el-dropdown-item
            >
            <el-dropdown-item divided @click="handleDeleteClick"
              >删除</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
  <el-row>
    <el-col :span="11">
      <el-table :data="segementList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="30"/>
        <el-table-column :label="`${total} 分段`">
          <template #default="scope">
            <el-row>
              <el-col :span="6">分段 {{ scope.row.position }} </el-col>
              <el-col :span="6"> {{ scope.row.word_count }} 字符</el-col>
              <el-col :span="6">召回次数 {{ scope.row.hit_count }} </el-col>
              <el-col :span="4"
                >{{ scope.row.status == "completed" ? "已启用" : "已禁用" }}
              </el-col>
              <el-col :span="2">
                <el-dropdown trigger="click" placement="bottom-end">
                  <el-icon style="cursor: pointer">
                    <MoreFilled />
                  </el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        @click="handleUpdateSegementClick(scope.row)"
                        >编辑</el-dropdown-item
                      >
                      <el-dropdown-item
                        divided
                        @click="handleDeleteSegement(scope.row)"
                        >删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-col>
            </el-row>
            <el-row>
              {{ scope.row.content }}
            </el-row>
            <el-row>
              <el-tag v-for="value in scope.row.keywords">{{ value }}</el-tag>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div class="toolbar" v-if="selectedRows.length > 0">
        <el-button type="default" class="btn">
              <el-icon><CircleCheck /></el-icon>  启用
            </el-button>
            <el-button type="default" class="btn">
              <el-icon><CircleClose /></el-icon>  禁用
            </el-button>
            <el-button type="danger" class="btn" style="color : #E05F57">
              <el-icon> <Delete /> </el-icon>  删除
            </el-button>
            <el-button type="default" class="btn">
              <el-icon><Remove /></el-icon>  取消
            </el-button>
      </div>
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        v-model:current-page="page"
        v-model:page-size="limit"
        @change="handlePageChange"
      />
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="11">
      <div class="document-message">
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
          <el-form-item label="分段规则">{{ document.dataset_process_rule }}</el-form-item>
          <el-form-item label="段落长度">{{ document.max_tokens }}</el-form-item>
          <el-form-item label="平均段落长度">{{ document.average_segment_length }} characters</el-form-item>
          <el-form-item label="段落数量">{{ document.segment_count }} paragraphs</el-form-item>
          <el-form-item label="召回次数">
            {{document.recall_count}}
            ({{ document.hit_count }}/{{ document.segment_count }})
          </el-form-item>
          <el-form-item label="嵌入时间">{{ document.indexing_latency }} sec</el-form-item>
          <el-form-item label="嵌入花费">{{ document.tokens }} tokens</el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>

  <el-dialog v-model="showRenameModel" title="重命名" width="800">
    <div>重命名</div>
    <el-input v-model="rename"></el-input>
    <div class="dialog-footer">
      <el-button type="primary" @click="handleRenameEnsure">确定 </el-button>
      <el-button @click="showRenameModel = false">取消</el-button>
    </div>
  </el-dialog>

  <UpdateSegement
    v-model="showUpdateSegementModel"
    :segement="newSegement"
    :documentId="document.id"
    :datasetId="datasetId"
    @update_data="handleUpdateData"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { MoreFilled } from "@element-plus/icons-vue";
import { getSegmentList, deleteSegment } from "@/service/segement";
import { ElMessage, ElMessageBox, rowContextKey } from "element-plus";
import UpdateSegement from "@/components/updateSegement.vue";
import  {getDocumentMetaData } from "@/service/document"

const { document, datasetId } = defineProps(["document", "datasetId"]);
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
  emit("update_status", status);
};

const handleRenameEnsure = () => {
  emit("rename", rename.value);
  showRenameModel.value = false;
};

const handleDeleteClick = () => {};

const selectedRows = ref<any>([]);
// 段落编辑
const handleSelectionChange = (rows:any) => {
  selectedRows.value = rows;
};

const updateData = () => {
  getSegmentList(datasetId, document.id, page.value, limit.value).then(
    (res) => {
      segementList.value = res.data;
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

// 获得文档信息和参数
const documentMessage = async() => {
  try {
    const res = await getDocumentMetaData(datasetId, document.id)
    document.size = formatFileSize(res.data_source_info.upload_file.size)//文件大小
    document.created_at = formatTimestamp(res.created_at)//上传时间
    document.updated_at = formatTimestamp(res.updated_at)//更新时间
    document.data_source_type = translationMessage(res.data_source_type)//来源

    document.dataset_process_rule = translationMessage(res.dataset_process_rule.mode)//分段规则
    document.max_tokens = res.dataset_process_rule.rules.segmentation.max_tokens //段落长度
    document.average_segment_length = res.average_segment_length//平均段落长度
    document.segment_count = res.segment_count//段落数量
    document.recall_count = calculatePercentage(res.hit_count,res.segment_count)
    document.indexing_latency = formatDecimal(res.indexing_latency)//嵌入时间
    if (res.tokens !== null && res.tokens !== undefined) {
      document.tokens = res.tokens.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      document.tokens = '0'; // 或其他默认值
    }
  } catch(error:any){
    ElMessage.error(`文档信息展示错误：${error.message}`);
  }
}
const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || isNaN(bytes)) return '未知';
  return (bytes / 1024).toFixed(2) + ' KB';
};
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '未知';
  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
const formatDecimal = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0.00';
  return num.toFixed(2);
};
const calculatePercentage = (numerator, denominator, decimalPlaces = 2) => {
  if (typeof numerator !== 'number' || typeof denominator !== 'number' || isNaN(numerator) || isNaN(denominator)) {
    return '0%'; 
  }
  if (denominator === 0) {
    return '0%';
  }
  const percentage = (numerator / denominator) * 100;
  const rounded = Number(percentage.toFixed(decimalPlaces));
  
  return `${rounded}%`;
};
const translationMessage = (str:string) => {
  const res:Record<string,string>= {
    upload_file:'文件上传',
    notion:'从Notion同步的文档',
    github:'从Github同步的代码',
    
    custom:'自定义',
    hierarchical:'父子分段',
  }
  return res[str];
}
const handleUpdateData = () => {
  updateData();
};

onMounted(() => {
  updateData();
  documentMessage();
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
.toolbar {
  position: fixed;
  bottom: 100px;
  left: 35%;
  transform: translate(-50%, 0%);
  min-width: 200px;
  border: 1px solid #409EFF;
  border-radius: 5px;
  background: #F5F7FF;

  padding: 5px;

  .btn {
    padding: 10px;
    background: #F5F7FF;
    border: 0px;
  }
}
.message-title {
  padding: 20px 0;
  font-weight: 700;
}
::v-deep .document-message .el-form .el-form-item__label {
  text-align: left !important;
  width: 180px !important;
  color: #a7a7a7 !important;
}
::v-deep .el-form-item--label-right .el-form-item__label {
    justify-content: flex-start;
}
</style>
