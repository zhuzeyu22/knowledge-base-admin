<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { UploadFilled, Back, Document, Delete } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import {  uploadDocument, UploadResponse, createDocument } from '@/service/datasets';

const route=useRoute()
const router=useRouter()
const radio = ref('datasets')
let uploadSequence = 0; // 上传序号计数器
const MAX_FILE_COUNT = 10; // 最大文件数量限制
let uploadingCount = 0; // 正在上传中的文件数量
// 监听 radio 变化，重置上传序号和清空文件列表
watch(() => radio.value, () => {
  uploadSequence = 0;
  uploadingCount = 0;
  // 切换上传类型时清空已上传的文件
  res.value = [];
  fileList.value = [];
});
//文件预览内容
const fileList = ref<UploadUserFile[]>([])
const res = ref<UploadResponse[]>([])

// 从路由参数中获取知识库ID
const datasetId = ref((route.query.id as string) || (route.params.id as string) || '')

// 处理超出文件数量限制
const handleExceed = (files: File[]) => {
  const remainingSlots = MAX_FILE_COUNT - res.value.length;
  if (remainingSlots > 0) {
    ElMessage.warning(`批量上传超过${MAX_FILE_COUNT}个文件，应按顺序只上传${MAX_FILE_COUNT}个文件`);
  } else {
    ElMessage.warning(`已达到最大文件数量限制${MAX_FILE_COUNT}个，请删除文件后再上传`);
  }
};

const handleUploadChange: UploadProps["onChange"] = (uploadFile,uploadFiles) => {
  // 计算当前已上传 + 正在上传的总数
  const totalCount = res.value.length + uploadingCount;
  
  // 如果已经达到或超过最大限制，不允许上传
  if (totalCount >= MAX_FILE_COUNT) {
    const index = uploadFiles.findIndex(f => f.uid === uploadFile.uid);
    ElMessage.error('已达到最大上传文件数量,请先删除列表中的文件在进行相应操作')
    if (index > -1) {
      uploadFiles.splice(index, 1);
    }
    return;
  }

  // 验证文件格式
  const type = uploadFile.name.replace(/.*\./, "");
  let regex =
    radio.value === "datasets"
      ? ["doc", "docx", "txt", "pdf", "html", "markdown", "md", "xls", "xlsx", "csv"]
      : ["csv", "xls", "xlsx"];

  if (!regex.find((x) => x === type)) {
    ElMessage.error("文件格式错误，请上传正确的文件格式");
    uploadFiles.pop();
    return;
  }
  // 开始上传文件
  const formData = new FormData();
  if (uploadFile.raw) {
    // 增加正在上传的计数
    uploadingCount++;
    // 为当前文件分配序号
    const currentSequence = uploadSequence++;
    formData.append("file", uploadFile.raw);
    uploadDocument(formData)
      .then((response) => {
        // 上传完成，减少上传中计数
        uploadingCount--;
        // 添加序号到响应对象
        const fileWithSequence = { ...response, sequence: currentSequence };
        res.value.push(fileWithSequence);
        // 按序号排序，确保显示顺序正确
        res.value.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
        console.log("File uploaded successfully:", response);
        if(res.value.length===10){
          ElMessage.warning('上传文件达到限制')
        }
      })
      .catch((error) => {
        // 上传失败，减少上传中计数
        uploadingCount--;
        ElMessage.error(`文件上传失败${error}`);
        console.error("File upload failed:", error);
        // 上传失败时从 fileList 中移除
        const index = uploadFiles.findIndex(f => f.uid === uploadFile.uid);
        if (index > -1) {
          uploadFiles.splice(index, 1);
        }
      });
  }
};


const handleNext = async () => {
    try {
        // 准备导入数据
        const file_ids = res.value.map(file => file.id)
        
        const importData = {
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
            process_rule: {
                mode: 'automatic',
                rules: {}
            }
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
// 删除文件
const handleDeleteFile = (fileId: string) => {
    const index = res.value.findIndex(file => file.id === fileId)
    if (index > -1) {
        res.value.splice(index, 1)
        // 同时从 fileList 中删除
        const fileListIndex = fileList.value.findIndex(file => file.uid === fileId)
        if (fileListIndex > -1) {
            fileList.value.splice(fileListIndex, 1)
        }
        ElMessage.success('文件已删除')
    }
}

// 获取文件扩展名
const getFileExtension = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toUpperCase() || ''
    return ext
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toFixed(2) + sizes[i]
}

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
        <el-main  class="context-style" style="overflow: auto">
            <el-card class="wapper-style" body-style="height: 100%; display: flex; flex-direction: row;">
                <el-col :span="11" style="display: flex; flex-direction: column;">
                    <div  style="flex-grow: 1">
                        <el-row>
                            <el-radio-group v-model="radio" text-color="#626aef" fill="rgb(239, 240, 253)"
                                style="margin-bottom: 10px;">
                                <el-radio-button label="文档上传" value="datasets" />
                                <el-radio-button label="问答对上传" value="qa_pairs" />
                            </el-radio-group>
                            <div style="padding: 10px; font-size: 14px;">
                                {{  radio === "datasets" ? '支持 PDF、DOC、DOCX、TXT 、HTML、MARKDOWN、XLS、XLSX、CSV文件格式，最大上传文件数量为10个，单个文件大小不超过 40MB' : '支持 XLS、XLSX、CSV文件格式，最大上传文件数量为10个，单个文件大小不超过 40MB' }}
                            </div>
                            <el-upload v-model:file-list="fileList" style="width: 100%;" drag :auto-upload="false"
                                :accept="radio === 'datasets' ? '.pdf,.doc,.docx,.txt,.html,.markdown,.md,.xls,.xlsx,.csv' : '.csv,.xls,.xlsx,'"
                                action=""  :on-change="handleUploadChange" :on-exceed="handleExceed"  multiple :show-file-list="false">
                                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                <div class="el-upload__text">
                                    <el-col>
                                        <el-button type="primary" size="small">选择文件上传</el-button>
                                    </el-col>
                                    <el-col style="margin-top: 10px;"> 或将文件拖拽到此处</el-col>
                                </div>
                            </el-upload>
                            <!-- 已上传文件列表 -->
                            <div v-if="res.length > 0" class="file-list-container">
                                <div class="file-list-card">
                                <div class="file-list-scroll">
                                    <div v-for="file in res" :key="file.id" class="uploaded-file-item">
                                        <div class="file-info">
                                            <el-icon class="file-icon" :size="32" color="#409EFF">
                                                <Document />
                                            </el-icon>
                                            <div class="file-details">
                                                <div class="file-name">{{ file.name }}</div>
                                                <div class="file-meta">{{ getFileExtension(file.name) }} · {{
                                                    formatFileSize(file.size) }}</div>
                                            </div>
                                        </div>
                                        <el-icon class="delete-icon" @click="handleDeleteFile(file.id)" :size="20"
                                            color="#909399">
                                            <Delete />
                                        </el-icon>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </el-row>
                    </div>
                    
                         
                    <div style=" align-self: flex-end; display: flex; flex-direction: row-reverse; justify-content:
                                space-between; margin-top: 10px;">
                        <el-button style="align-self: flex-end;" type="primary"
                            :disabled="res.length === 0" @click="handleNext">下一步</el-button>
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