<template>
    <el-container class="content-container">
        <BackHeader title="增加知识库和文档" />
        <el-row v-if="step == 1" class="context-style" :gutter="32">
            <el-col :span="12" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
                <FileType v-model:radio="radio"></FileType>
                <UploadFiles v-model:file-list="fileList" :accept="accept" @click="handleFileClick"></UploadFiles>
                <el-row style="display: flex; justify-content: flex-end;">
                    <el-button type="primary" :disabled="fileList.length === 0" @click="handleNext">下一步</el-button>
                </el-row>
            </el-col>
            <!-- Step 1 右侧：根据是否点击文件列表显示内容 -->
            <el-col :span="12" style="display: flex; flex-direction: column; height: 100%">
                <!-- 未点击文件列表时显示空白 -->
                <div v-if="!showPreview" style="width: 100%; height: 100%"></div>
                <!-- 点击文件列表后显示预览 -->
                <div v-else style="display: flex; flex-direction: column; height: 100%">
                    <el-row style="margin-bottom: 10px">
                        <div class="title">文件预览</div>
                    </el-row>
                    <!-- 文件内容预览 -->
                    <el-card shadow="never" style="
                  flex: 1;
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;
                " body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
                        <div v-if="!previewFile" style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    color: #909399;
                  ">
                            请选择要预览的文件
                        </div>
                        <div v-else style="
                    white-space: pre-wrap;
                    word-break: break-word;
                    line-height: 1.6;
                    font-size: 14px;
                  ">
                            {{ previewContent }}
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
        <el-row v-else-if="step == 2" class="context-style" :gutter="32">
            <el-col :span="12" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
                <div
                    style="margin-bottom: 10px;overflow-x: hidden; overflow-y: auto; gap: 8px; display: flex; flex-direction: column;">
                    <div class="title">分段设置</div>
                    <Custom v-if="radio == UploadFileIs.datasets" :visiable="process_rule == 'custom'"
                        v-model:custom="custom" @preview="handlePreviewClick" @reset="handleResetClick"
                        @selected="() => handleSelectedProcessRule('custom', ChunkingMode.text)" />
                    <Hierarchical v-if="radio == UploadFileIs.datasets" :visiable="process_rule == 'hierarchical'"
                        v-model:hierarchical="hierarchical" @preview="handlePreviewClick" @reset="handleResetClick"
                        @selected="() => handleSelectedProcessRule('hierarchical', ChunkingMode.parentChild)" />
                    <QaModel v-if="radio == UploadFileIs.qa_pairs" @preview="handlePreviewClick" />
                </div>
                <el-row style="display: flex; justify-content: flex-end;">
                    <el-button type="primary" @click="handlePrev">上一步</el-button>
                    <el-button type="primary" @click="handleInit">保存并处理</el-button>
                </el-row>
            </el-col>
            <el-col :span="12" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
                <Preview v-loading="previewLoading" v-model:preview-file="previewFile"
                    v-model:segment-preview="segmentPreview" v-model:file-list="fileList"></Preview>
            </el-col>
        </el-row>
    </el-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { ElMessage, type UploadUserFile } from "element-plus";
import {
    UploadResponse,
    getFilesPreview,
    fetchFileIndexingEstimate,
    getEmbeddingList,
    type IndexingEstimateParams,
    createDocument,
} from "@/service/datasets";
import UploadFiles from "@/components/uploadFiles/index.vue";
import FileType from "@/components/uploadFiles/file-type.vue";
import { ChunkingMode, RetrievalModel } from "@/models/dataset";
import Custom from "@/components/datasetSetting/segement/custom.vue";
import Hierarchical from "@/components/datasetSetting/segement/hierarchical.vue";
import Preview from "@/components/datasetSetting/preview.vue";
import BackHeader from "@/components/backHeader/index.vue";
import QaModel from "@/components/datasetSetting/segement/qaModel.vue"
import { UploadFileIs } from "@/models/dataset";
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 从路由参数中获取知识库ID
const datasetId = ref((route.query.id as string) || (route.params.id as string) || '')
const radio = ref<UploadFileIs>(UploadFileIs.datasets);

//文件预览内容
const fileList = ref<(UploadResponse & UploadUserFile)[]>([]);
const previewFile = ref<string | null>(null);
const previewContent = ref<string>("");
const showPreview = ref(false); // 控制是否显示文件预览模块
const segmentPreview = ref<any[]>([]); // 存储分段预览数据
const isSegmentPreview = ref(false); // 标识当前是否为分段预览模式
const previewLoading = ref(false);
const step = ref(1);
const doc_form = ref<ChunkingMode>(ChunkingMode.text);

// 监听 radio 变化，重置上传序号和清空文件列表
watch(
    () => radio.value,
    (newRadio) => {
        // 切换上传类型时清空已上传的文件
        fileList.value = [];
        previewFile.value = null;
        previewContent.value = "";
        showPreview.value = false;
        if (newRadio === 'datasets') {
            doc_form.value = ChunkingMode.text;
        } else {
            doc_form.value = ChunkingMode.qa;
        }
    }
);
// accept
const accept = computed(() => {
    return radio.value === 'datasets' ? '.pdf,.doc,.docx,.txt,.html,.markdown,.md,.xls,.xlsx,.csv,.pptx' : '.csv,.xls,.xlsx'
});

const process_rule = ref("custom");

const custom = ref({
    pre_processing_rules: [
        {
            id: "remove_extra_spaces",
            enabled: false,
        },
        {
            id: "remove_urls_emails",
            enabled: false,
        },
    ],
    segmentation: {
        separator: "\\n\\n",
        max_tokens: 500,
        chunk_overlap: 50,
    },
});

const hierarchical = ref({
    parent_mode: "paragraph",
    pre_processing_rules: [
        {
            id: "remove_extra_spaces",
            enabled: false,
        },
        {
            id: "remove_urls_emails",
            enabled: false,
        },
    ],
    segmentation: {
        separator: "\\n\\n",
        max_tokens: 500,
    },
    subchunk_segmentation: {
        separator: "\\n\\n",
        max_tokens: 200,
    },
});

const indexing_technique = ref("high_quality");
const embedding_model = ref("");
const embedding_model_provider = ref("");
const embedding_model_options = ref<any[]>([]);

const retrieval_model = ref<RetrievalModel>({
    search_method: "semantic_search",
    top_k: 5,
    reranking_enable: true,
    reranking_model: {
        reranking_model_name: "gte-rerank-v2",
        reranking_provider_name: "langgenius/tongyi/tongyi",
    },
    score_threshold: 0.5,
    score_threshold_enabled: false,
    reranking_mode: "weighted_score",
    weights: {
        keyword_setting: {
            keyword_weight: 0.3,
        },
        vector_setting: {
            embedding_model_name: "",
            embedding_provider_name: "",
            vector_weight: 0.7,
        },
        weight_type: "customized",
    },
});

// Embedding 模型选择
const getEmbeddingModel = async () => {
    try {
        const res = await getEmbeddingList();

        embedding_model_options.value = [];

        res.data.forEach((providerItem) => {
            providerItem.models.forEach((model) => {
                embedding_model_options.value.push({
                    value: model.model,
                    label: model.label.zh_Hans, //中文标签
                    provider: providerItem.provider,
                });
            });
        });
        if (embedding_model_options.value.length > 0) {
            embedding_model.value = embedding_model_options.value[0].value;
            embedding_model_provider.value =
                embedding_model_options.value[0].provider;
        }
    } catch (error) {
        ElMessage.error("获取Embedding模型选项失败");
    }
};

// official
// unofficial
const official = ref("official");

const handlePrev = () => {
    step.value -= 1;
    // 从 step 2 返回到 step 1 时，重置预览状态
    if (step.value === 1) {
        showPreview.value = false;
    }
};
const handleNext = () => {
    // check
    const check = fileList.value.find(x => x.status !== 'success')
    console.log(check)
    if (check) {
        return ElMessage.warning("有文件上传不成功");
    }

    step.value += 1;

    if (radio.value === "qa_pairs") {
        process_rule.value = ''
    } else {
        process_rule.value = 'custom'
    }

    // 从 step 1 进入 step 2 时，清空文件预览内容
    if (step.value === 2) {
        previewContent.value = "";
        previewFile.value = null;
        showPreview.value = false;
    }
};

const handleSelectedProcessRule = (value: string, mode: ChunkingMode) => {
    process_rule.value = value;
    doc_form.value = mode
    return
}

const handleInit = () => {
    // 校验数据
    if (process_rule.value === "custom") {
        if (custom.value.segmentation.separator == '') {
            return ElMessage.warning("分段标识符不能为空");
        }
        if (!custom.value.segmentation.max_tokens) {
            return ElMessage.warning("分段最大长度不能为空");
        }
        if (!custom.value.segmentation.chunk_overlap) {
            return ElMessage.warning("分段重叠长度不能为空");
        }
        if (custom.value.segmentation.max_tokens < custom.value.segmentation.chunk_overlap) {
            return ElMessage.warning("分段最大长度应大于分段重叠长度");
        }
    }

    if (process_rule.value === "hierarchical") {
        if (hierarchical.value.parent_mode == 'paragraph') {
            if (hierarchical.value.segmentation.separator == '') {
                return ElMessage.warning("父块分段标识符不能为空");
            }
            if (!hierarchical.value.segmentation.max_tokens) {
                return ElMessage.warning("父块分段最大长度不能为空");
            }
        }
        if (hierarchical.value.subchunk_segmentation.separator == '') {
            return ElMessage.warning("子块分段标识符不能为空");
        }
        if (!hierarchical.value.subchunk_segmentation.max_tokens) {
            return ElMessage.warning("子块分段最大长度不能为空");
        }
    }

    const params = {
        data_source: {
            type: "upload_file",
            info_list: {
                data_source_type: "upload_file",
                file_info_list: {
                    file_ids: fileList.value.map((x) => x.id),
                },
            },
        },
        doc_form: doc_form.value,
        doc_language: "Chinese Simplified",
        embedding_model: embedding_model.value,
        embedding_model_provider: embedding_model_provider.value,
        indexing_technique: indexing_technique.value,
        process_rule: {
            mode: process_rule.value === '' ? "custom" : process_rule.value,
            rules:
                process_rule.value === "custom" ? custom.value : hierarchical.value,
        },
        retrieval_model: retrieval_model.value,
        official: official.value,
    };

    createDocument(datasetId.value, params).then((res) => {
        ElMessage.success('文档导入成功')

        // 返回到详情页面
        router.back()
    });
};

// 获取文件预览内容
const fetchFilePreview = async (fileId: string) => {
    if (!fileId) {
        previewContent.value = "";
        return;
    }
    try {
        const response = await getFilesPreview(fileId);
        previewContent.value = response.content || "暂无预览内容";
    } catch (error) {
        console.error("获取文件预览失败:", error);
        ElMessage.error("获取文件预览失败");
        previewContent.value = "加载失败，请重试";
    }
};

//点击预览按钮
const handlePreviewClick = () => {
    // 增加参数校验
    if (
        custom.value?.segmentation?.max_tokens &&
        custom.value.segmentation.max_tokens <
        custom.value.segmentation.chunk_overlap
    ) {
        ElMessage.warning("分段最大长度应大于分段重叠长度");
        return;
    }

    if (fileList.value.length > 0) {
        const params: IndexingEstimateParams = {
            doc_form: doc_form.value,
            doc_language: "Chinese Simplified",
            indexing_technique: indexing_technique.value,
            info_list: {
                data_source_type: "upload_file",
                file_info_list: {
                    file_ids: fileList.value.map((x) => x.id),
                },
            },
            process_rule: {
                mode: process_rule.value === '' ? "custom" : process_rule.value,
                rules: process_rule.value === 'custom' ? custom.value : hierarchical.value,
            },
        };
        previewLoading.value = true
        fetchFileIndexingEstimate(params)
            .then((response) => {
                // 处理返回的分段内容,且不为空的
                if (response && response.preview) {
                    if (radio.value === "datasets") {
                        segmentPreview.value = response.preview;
                    } else {
                        segmentPreview.value = response.qa_preview;
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
            }).finally(() => {
                previewLoading.value = false
            });
    } else {
        ElMessage.warning("请先上传文件");
    }
};

const handleResetClick = () => {
    custom.value = {
        pre_processing_rules: [
            {
                id: "remove_extra_spaces",
                enabled: false,
            },
            {
                id: "remove_urls_emails",
                enabled: false,
            },
        ],
        segmentation: {
            separator: "\\n\\n",
            max_tokens: 500,
            chunk_overlap: 50,
        },
    }

    hierarchical.value = {
        parent_mode: "paragraph",
        pre_processing_rules: [
            {
                id: "remove_extra_spaces",
                enabled: false,
            },
            {
                id: "remove_urls_emails",
                enabled: false,
            },
        ],
        segmentation: {
            separator: "\\n\\n",
            max_tokens: 500,
        },
        subchunk_segmentation: {
            separator: "\\n\\n",
            max_tokens: 200,
        },
    }

}

// 点击文件名显示预览
const handleFileClick = (fileId: string) => {
    if (step.value === 1) {
        showPreview.value = true; // 显示预览模块
        previewFile.value = fileId; // 选中该文件
    }
};

// watch侦听文件选择变化，自动获取预览内容
watch(previewFile, (newFileId) => {
    if (newFileId) {
        // 在 step 1 时，只获取文件原始内容
        if (step.value === 1) {
            fetchFilePreview(newFileId)
                .then((response) => {
                    //previewContent.value = response.content
                })
                .catch((error) => {
                    console.error("获取文件预览失败:", error);
                    previewContent.value = "加载失败，请重试";
                });
        }
        // 在 step 2 时，获取分段预览
        else if (step.value === 2) {
            // 增加参数校验
            if (
                custom?.segmentation?.max_tokens &&
                custom.segmentation.max_tokens < custom.segmentation.chunk_overlap
            ) {
                ElMessage.warning("分段最大长度应大于分段重叠长度");
                return;
            }

            const params: IndexingEstimateParams = {
                doc_form: doc_form.value,
                doc_language: "Chinese Simplified",
                indexing_technique: indexing_technique.value,
                info_list: {
                    data_source_type: "upload_file",
                    file_info_list: {
                        file_ids: [newFileId],
                    },
                },
                process_rule: {
                    mode: process_rule.value === '' ? "custom" : process_rule.value,
                    rules: custom.value,
                },
            };

            fetchFileIndexingEstimate(params)
                .then((response) => {
                    // 处理返回的分段内容
                    if (response && response.preview) {
                        if (radio.value === "datasets") {
                            segmentPreview.value = response.preview;
                        } else {
                            segmentPreview.value = response.qa_preview;
                        }
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
        }
    } else {
        previewContent.value = "";
        segmentPreview.value = [];
        isSegmentPreview.value = false;
    }
});

onMounted(() => {
    getEmbeddingModel();
    // getRerankModel();
});
</script>

<style scoped lang="scss">
.content-container {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 16px;
    height: calc(100%);
    padding: 24px;
}

.context-style {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow: hidden;
}

.title {
    font-size: 14px;
    font-weight: 600;
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

// 文件列表容器样式
.file-list-container {
    margin-top: 20px;
    width: 100%;
}

.file-list-card {
    max-height: 400px;
    overflow: hidden;
}

.file-list-scroll {
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 8px;

    // 美化滚动条
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;

        &:hover {
            background: #a8a8a8;
        }
    }
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

// 旋转动画
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
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
