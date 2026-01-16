<script setup lang="ts">
import UploadFiles from "@/components/uploadFiles/index.vue";
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { UploadFilled, Back, Document, Delete } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import { uploadDocument, UploadResponse, createDocument, getFilesPreview, getDatasetProcessRule } from '@/service/datasets';

const route = useRoute()
const router = useRouter()
const radio = ref('datasets')
let uploadSequence = 0; // 上传序号计数器
let uploadingCount = 0; // 正在上传中的文件数量

// 监听 radio 变化，重置上传序号和清空文件列表
watch(() => radio.value, () => {
    uploadSequence = 0;
    uploadingCount = 0;
    // 切换上传类型时清空已上传的文件
    fileList.value = [];
});

// accept
const accept = computed(() => {
  return radio.value === 'datasets' ? '.pdf,.doc,.docx,.txt,.html,.markdown,.md,.xls,.xlsx,.csv' : '.csv,.xls,.xlsx'
});

//文件预览内容
const fileList = ref<(UploadResponse & UploadUserFile)[]>([]);

// 从路由参数中获取知识库ID
const datasetId = ref((route.query.id as string) || (route.params.id as string) || '')
const process_rule = ref({
        mode: 'automatic',
        rules: {}
    })
watch(
    datasetId,
    async (newDatasetId) => {
        if(newDatasetId){
            process_rule.value = await getDatasetProcessRule(newDatasetId);
        }else{
            process_rule.value = {
                mode: 'automatic',
                rules: {}
            }
        }   
    },{
        immediate: true
    }
)

const handleNext = async () => {
    try {
        // 准备导入数据
        const file_ids = fileList.value.map(file => file.id)
        const importData = {
            doc_form: radio.value === 'datasets' ? 'text_model' : 'qa_model',
            doc_language: 'Chinese Simplified',
            data_source: {
                type: 'upload_file',
                info_list: {
                    data_source_type: 'upload_file',
                    file_info_list: {
                        file_ids: file_ids
                    }
                }
            },
            indexing_technique: 'high_quality',
            process_rule: process_rule.value
        }

        // 调用导入文档接口
        await createDocument(datasetId.value, importData)

        ElMessage.success('文档导入成功')

        // 返回到详情页面
        router.back()

    } catch (error: any) {
        ElMessage.error(error.message || '文档导入失败')
        console.error('Import failed:', error)
    }
}

//文件预览内容
const previewFile = ref<string | null>(null);
const previewContent = ref<string>("");
const showPreview = ref(false); // 控制是否显示文件预览模块
const segmentPreview = ref<any[]>([]); // 存储分段预览数据
const isSegmentPreview = ref(false); // 标识当前是否为分段预览模式

// 点击文件名显示预览
const handleFileClick = (fileId: string) => {
    showPreview.value = true; // 显示预览模块
    previewFile.value = fileId; // 选中该文件
};

// watch侦听文件选择变化，自动获取预览内容
watch(previewFile, (newFileId) => {
    if (newFileId) {
        // 在 step 1 时，只获取文件原始内容
        fetchFilePreview(newFileId)
            .then((response) => {
                //previewContent.value = response.content
            })
            .catch((error) => {
                console.error("获取文件预览失败:", error);
                previewContent.value = "加载失败，请重试";
            });
    } else {
        previewContent.value = "";
        segmentPreview.value = [];
        isSegmentPreview.value = false;
    }
});

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
</script>

<template>
    <el-container class="content-container">
        <el-header class="header-style">
            <el-button type="primary" link size="default" @click="router.back()" style="padding: 0; margin-right: 16px">
                <el-icon>
                    <Back />
                </el-icon>
            </el-button>
            <div>增加知识库和文档</div>
        </el-header>
        <el-main class="context-style" style="overflow: auto">
            <el-card class="wapper-style" body-style="height: 100%; display: flex; flex-direction: row;">
                <el-col :span="11" style="display: flex; flex-direction: column;">
                    <div style="flex-grow: 1">
                        <el-row>
                            <el-row style="display: flex; align-items: center; margin-bottom: 10px;">
                                <el-radio-group v-model="radio" text-color="#626aef" fill="rgb(239, 240, 253)"
                                    style="margin-bottom: 10px;">
                                    <el-radio-button label="文档上传" value="datasets" />
                                    <el-radio-button label="问答对上传" value="qa_pairs" />
                                </el-radio-group>
                                <div style="margin-left: 8px; font-size: 14px; color: #409eff;">
                                    <a href="/template/QA.xlsx" download="QA模板.xlsx">下载模板</a>
                                </div>
                            </el-row>
                            <div style="padding: 10px; font-size: 14px;">
                                {{ `支持 ${radio === 'datasets' ? "DOC、DOCX、TXT、PDF、HTML、MARKDOWN" : ''}XLSX、XLS、、CSV
                                文件格式，最大上传文件数量为10个，单个文件大小不超过 40MB` }}
                            </div>
                        </el-row>
                        <UploadFiles v-model:file-list="fileList" :accept="accept" @click="handleFileClick"></UploadFiles>
                    </div>


                    <div style=" align-self: flex-end; display: flex; flex-direction: row-reverse; justify-content:
                                space-between; margin-top: 10px;">
                        <el-button style="align-self: flex-end;" type="primary" :disabled="fileList.length === 0"
                            @click="handleNext">下一步</el-button>
                    </div>
                </el-col>
                <!-- diliver -->
                <el-col :span="2"></el-col>
                <el-col :span="11" style="display: flex; flex-direction: column; height: 100%;">
                    <!-- 未点击文件列表时显示空白 -->
                    <div v-if="!showPreview" style="width: 100%; height: 100%;"></div>
                    <!-- 点击文件列表后显示预览 -->
                    <div v-else style="display: flex; flex-direction: column; height: 100%;">
                        <el-row style="margin-bottom: 10px;">
                            <div class="title">文件预览</div>
                        </el-row>
                        <!-- 文件内容预览 -->
                        <el-card shadow="never" style="flex:1; overflow: hidden; display: flex; flex-direction: column;"
                            body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
                            <div v-if="!previewFile"
                                style="display: flex; justify-content: center; align-items: center; height: 100%; color: #909399;">
                                请选择要预览的文件</div>
                            <div v-else
                                style="white-space: pre-wrap; word-break: break-word; line-height: 1.6; font-size: 14px;">
                                {{ previewContent }}
                            </div>
                        </el-card>
                    </div>
                </el-col>
            </el-card>
        </el-main>
    </el-container>
</template>

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
    max-height: 360px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;

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
</style>