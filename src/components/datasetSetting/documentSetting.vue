<template>
  <!-- 示例文件，组件使用例子 -->
  <el-container class="content-container">
    <el-main class="context-style" style="overflow: auto">
      <el-card
        class="wapper-style"
        body-style="height: 100%; display: flex; flex-direction: row;"
      >
        <el-col :span="11" style="display: flex; flex-direction: column">
          <div style="flex-grow: 1; overflow-y: auto">
            <el-col style="margin-bottom: 10px">
              <SegementSetting
                v-if="documentSetting.document_process_rule.mode == 'custom'"
                v-model:custom="documentSetting.document_process_rule.rules"
                v-model:process_rule="
                  documentSetting.document_process_rule.mode
                "
                @preview="handlePreviewButton"
              />
              <SegementSetting
                v-else
                v-model:hierarchical="
                  documentSetting.document_process_rule.rules
                "
                v-model:process_rule="
                  documentSetting.document_process_rule.mode
                "
                @preview="handlePreviewButton"
              />
            </el-col>
            <!-- <el-col style="margin-bottom: 10px">
              <Embedding
                v-model:embedding_model="datasetInfo.embedding_model"
                :disabled="true"
              ></Embedding>
            </el-col>
            <el-col style="margin-bottom: 10px">
              <Retrieval
                v-model:retrieval_model="datasetInfo.retrieval_model_dict"
                :disabled="true"
              ></Retrieval>
            </el-col> -->
          </div>
          <div
            style="
              align-self: flex-end;
              display: flex;
              flex-direction: row-reverse;
              justify-content: space-between;
              margin-top: 10px;
            "
          >
            <el-button type="primary" @click="handleSave">保存并处理</el-button>
            <el-button
              type="primary"
              @click="handleCancle"
              style="margin-right: 10px"
              >取消</el-button
            >
          </div>
        </el-col>
        <!-- diliver -->
        <el-col :span="2"> </el-col>
        <!-- Step 2 右侧：文件预览 -->
        <el-col
          :span="11"
          style="display: flex; flex-direction: column; height: 100%"
        >
          <Preview
            v-model:preview-file="previewFile"
            v-model:segment-preview="segmentPreview"
            v-model:file-list="fileList"
          ></Preview>
        </el-col>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage, type UploadProps, type UploadUserFile } from "element-plus";
import {
  initDataset,
  uploadDocument,
  UploadResponse,
  getFilesPreview,
  fetchFileIndexingEstimate,
  type IndexingEstimateParams,
} from "@/service/datasets";
import { RetrievalModel } from "@/models/dataset";
import SegementSetting from "./segement/index.vue";
// import IndexingTechnique from "./indexingTechnique.vue";
import Embedding from "./embedding .vue";
import Retrieval from "./retrieval.vue";
import Preview from "./preview.vue";
import { postDocumentSettings } from "@/service/document";

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
  // console.log("documentSetting", documentSetting);
  if (documentSetting.value.data_source_info.upload_file) {
    // 根据当前选择的 process_rule 模式获取对应的配置

    const params: IndexingEstimateParams = {
      doc_form: "text_model",
      doc_language: "English",
      indexing_technique: indexing_technique.value,
      info_list: {
        data_source_type: "upload_file",
        file_info_list: {
          file_ids: [documentSetting.value.data_source_info.upload_file.id],
        },
      },
      process_rule: documentSetting.value.document_process_rule,
    };

    fetchFileIndexingEstimate(params)
      .then((response) => {
        console.log("分段预览结果:", response);
        // 处理返回的分段内容,且不为空的
        if (response && response.preview) {
          segmentPreview.value = response.preview;
          isSegmentPreview.value = true;
          ElMessage.success("分段预览加载成功");
        } else {
          ElMessage.warning("暂无分段预览数据");
        }
      })
      .catch((error) => {
        console.error("获取分段预览失败:", error);
        ElMessage.error("获取分段预览失败");
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
        mode: documentSetting.value.document_process_rule.rules,
        rules: documentSetting.value.document_process_rule.mode,
      },
    };

    fetchFileIndexingEstimate(params)
      .then((response) => {
        console.log("分段预览结果:", response);
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
</script>

<style scoped lang="scss">
.header-style {
  display: flex;
  background-color: #f5f5f5;
  align-items: center;
  height: auto;
  // border-bottom: 1px solid var(--el-border-color);
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
  > .el-slider__runway {
    margin-right: 10px;
  }

  > .el-input-number {
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
    border-color: #409eff;
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
