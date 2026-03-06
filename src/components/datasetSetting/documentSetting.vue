<template>
  <!-- 示例文件，组件使用例子 -->
  <el-row class="context-style" :gutter="32">
    <el-col :span="12" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
      <div
        style="margin-bottom: 10px;overflow-x: hidden; overflow-y: auto; gap: 8px; display: flex; flex-direction: column; flex: 1;">
        <div class="title">分段设置</div>
        <div v-if="documentSetting.doc_form == ChunkingMode.text">
          <Custom :visiable="true" v-model:custom="documentSetting.document_process_rule.rules"
            @preview="handlePreviewButton" @reset="handleResetClick" />
        </div>
        <div v-else-if="documentSetting.doc_form == ChunkingMode.parentChild">
          <Hierarchical :visiable="true" v-model:hierarchical="documentSetting.document_process_rule.rules"
            @preview="handlePreviewButton" @reset="handleResetClick" />
        </div>
        <div v-else-if="documentSetting.doc_form == ChunkingMode.qa">
          <QaModel @preview="handlePreviewButton" />
        </div>
      </div>
      <el-row style="display: flex; justify-content: space-between;">
        <el-button class="prev-btn" @click="handleCancle">
          <el-icon class="arrow-icon"><Back /></el-icon>
          返回
        </el-button>
        <el-button type="primary" @click="handleSave">保存并处理</el-button>
      </el-row>
    </el-col>
    <!-- Step 2 右侧：文件预览 -->
    <el-col :span="12" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
      <Preview v-model:preview-file="previewFile" v-model:segment-preview="segmentPreview" v-model:file-list="fileList">
      </Preview>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onActivated } from "vue";
import { ElMessage } from "element-plus";
import {
  fetchFileIndexingEstimate,
  type IndexingEstimateParams,
} from "@/service/datasets";
import Preview from "./preview.vue";
import { postDocumentSettings } from "@/service/document";
import Custom from "@/components/datasetSetting/segement/custom.vue";
import Hierarchical from "@/components/datasetSetting/segement/hierarchical.vue";
import { ChunkingMode } from "@/models/dataset";
import QaModel from "@/components/datasetSetting/segement/qaModel.vue"
import { Back } from "@element-plus/icons-vue";

// Document
const documentSetting = defineModel("documentSetting");
const { datasetId, datasetInfo } = defineProps(["datasetId", "datasetInfo"]);

const emit = defineEmits(["cancle", "save"]);

const fileList = computed(() => {
  return [documentSetting.value.data_source_info.upload_file];
});
const previewFile = computed(() => {
  return documentSetting.value.data_source_info.upload_file;
});

//文件预览内容
const previewContent = ref<string>("");
const segmentPreview = ref<any[]>([]); // 存储分段预览数据
const isSegmentPreview = ref(false); // 标识当前是否为分段预览模式

const indexing_technique = ref("high_quality");
const handleCancle = () => {
  emit("cancle");
};

const handleSave = () => {
  // 增加参数校验
  if (
    documentSetting?.value?.document_process_rule?.rules?.segmentation
      ?.max_tokens &&
    documentSetting.value.document_process_rule.rules.segmentation.max_tokens <
    documentSetting.value.document_process_rule.rules.segmentation
      .chunk_overlap
  ) {
    console.log(
      "documentSetting.value.document_process_rule.rules.segmentation.max_tokens",
      documentSetting.value.document_process_rule.rules.segmentation.max_tokens
    );
    ElMessage.warning("分段最大长度应大于分段重叠长度");
    return;
  }

  console.log("documentSetting", documentSetting);
  const params = {
    original_document_id: documentSetting.value.id,
    doc_form: documentSetting.value.doc_form,
    doc_language: documentSetting.value.doc_language,
    process_rule: {
      rules: documentSetting.value.document_process_rule.rules,
      mode: documentSetting.value.document_process_rule.mode,
    },
    retrieval_model: datasetInfo.retrieval_model_dict,
    embedding_model: datasetInfo.embedding_model,
    embedding_model_provider: datasetInfo.embedding_model_provider,
    indexing_technique: datasetInfo.indexing_technique,
  };

  postDocumentSettings(datasetId, params)
    .then((res) => {
      console.log("res", res);

      ElMessage.success("修改成功");
      emit("save");
    })
    .catch((err) => {
      ElMessage.error("修改失败");
    });
};

//点击预览按钮
const handlePreviewButton = () => {
  // 增加参数校验
  if (
    documentSetting?.value?.document_process_rule?.rules?.segmentation
      ?.max_tokens &&
    documentSetting.value.document_process_rule.rules.segmentation.max_tokens <
    documentSetting.value.document_process_rule.rules.segmentation
      .chunk_overlap
  ) {
    console.log(
      "documentSetting.value.document_process_rule.rules.segmentation.max_tokens",
      documentSetting.value.document_process_rule.rules.segmentation.max_tokens
    );
    ElMessage.warning("分段最大长度应大于分段重叠长度");
    return;
  }

  // console.log("documentSetting", documentSetting);
  if (documentSetting.value.data_source_info.upload_file) {
    // 根据当前选择的 process_rule 模式获取对应的配置

    const params: IndexingEstimateParams = {
      doc_form: documentSetting.value.doc_form,
      doc_language: documentSetting.value.doc_language,
      indexing_technique: indexing_technique.value,
      info_list: {
        data_source_type: "upload_file",
        file_info_list: {
          file_ids: [documentSetting.value.data_source_info.upload_file.id],
        },
      },
      process_rule: {
        rules: documentSetting.value.document_process_rule.rules,
        mode: documentSetting.value.document_process_rule.mode,
      },
    };

    fetchFileIndexingEstimate(params)
      .then((response) => {
        // 处理返回的分段内容,且不为空的
        if (response && response.preview) {
          if (documentSetting.value.doc_form == ChunkingMode.qa) {
            segmentPreview.value = response.qa_preview;
          } else {
            segmentPreview.value = response.preview;
          }
          isSegmentPreview.value = true;
          ElMessage.success("分段预览加载成功");
        } else {
          ElMessage.warning("暂无分段预览数据");
        }
      })
      .catch((error) => {
        console.error("获取分段预览失败:", error);
        ElMessage.error(`获取分段预览失败: ${error}`);
      });
  } else {
    ElMessage.warning("请先上传文件");
  }
};

// watch侦听文件选择变化，自动获取预览内容
watch(previewFile, (newFileId) => {
  if (newFileId) {
    // 在 step 2 时，获取分段预览
    const params: IndexingEstimateParams = {
      doc_form: "text_model",
      doc_language: "English",
      indexing_technique: indexing_technique.value,
      info_list: {
        data_source_type: "upload_file",
        file_info_list: {
          file_ids: [newFileId],
        },
      },
      process_rule: {
        rules: documentSetting.value.document_process_rule.rules,
        mode: documentSetting.value.document_process_rule.mode,
      },
    };

    fetchFileIndexingEstimate(params)
      .then((response) => {
        // 处理返回的分段内容
        if (response && response.preview) {
          segmentPreview.value = response.preview;
          isSegmentPreview.value = true;
        } else {
          segmentPreview.value = [];
          isSegmentPreview.value = false;
        }
      })
      .catch((error) => {
        console.error("获取分段预览失败:", error);
        segmentPreview.value = [];
        isSegmentPreview.value = false;
      });
  } else {
    previewContent.value = "";
    segmentPreview.value = [];
    isSegmentPreview.value = false;
  }
});

const deepCopy = (newObj, obj) => {
  for (let key in obj) {
    let item = obj[key]
    if (item instanceof Array) {
      newObj[key] = []
      deepCopy(newObj[key], item)
    } else if (item instanceof Function) {
      newObj[key] = obj[key]
    } else if (item instanceof Object) {
      newObj[key] = {}
      deepCopy(newObj[key], item)
    } else {
      newObj[key] = item
    }
  }
}
const forSave = ref({})

onMounted(() => {
  deepCopy(forSave.value, documentSetting.value.document_process_rule.rules)
})

const handleResetClick = () => {
  deepCopy(documentSetting.value.document_process_rule.rules, forSave.value)
}
</script>

<style scoped lang="scss">
.prev-btn {
  background-color: #EDEFF4;
  border: 1px solid #dcdfe6;

  &:hover {
    background-color: #e0e3e9;
  }

  .arrow-icon {
    margin-right: 4px;
    font-weight: bold;
  }
}
.content-container {
  height: 100%;
  width: 100%;
}

.context-style {
  height: 100%;
  width: 100%;
}

.wapper-style {
  height: 100%;
}

.title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}

.collapse-item-title {
  font-size: 14px;
  height: 20px;
  display: flex;
  flex-direction: row;
}

.slider-style {
  >.el-slider__runway {
    margin-right: 10px;
  }

  >.el-input-number {
    width: 60px !important;
  }
}

.font-weight {
  font-weight: 600;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e6e8eb;
  }

  .file-info {
    display: flex;
    align-items: center;
    flex: 1;
    cursor: pointer;

    .file-icon {
      margin-right: 12px;
      flex-shrink: 0;
    }

    .file-details {
      flex: 1;
      min-width: 0;

      .file-name {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-meta {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .delete-icon {
    cursor: pointer;
    flex-shrink: 0;
    margin-left: 12px;
    transition: color 0.3s ease;

    &:hover {
      color: #f56c6c !important;
    }
  }
}

.segment-item {
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;

  &:hover {
    border-color: #5169f0;
  }

  :deep(.el-card__header) {
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
  }

  :deep(.el-card__body) {
    padding: 16px;
  }
}
</style>
