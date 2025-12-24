<template>
    <section class="section">
        <el-upload v-model:file-list="fileList" style="width: 100%" drag :auto-upload="false" :accept="accept" action=""
            ref="uploadRef" :on-change="handleUploadChange" :limit="MAX_FILE_COUNT" :on-exceed="handleExceed" multiple
            :show-file-list="false">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                <el-col>
                    <el-button type="primary" size="small">选择文件上传</el-button>
                </el-col>
                <el-col style="margin-top: 10px"> 或将文件拖拽到此处</el-col>
            </div>
        </el-upload>
        <!-- 已上传文件列表 -->
        <div v-if="fileList.length > 0" class="file-list-container">
            <div class="file-list-card">
                <div class="file-list-scroll">
                    <div v-for="file in fileList" :key="file.id" class="uploaded-file-item">
                        <div class="file-info" @click="handleFileClick(file.id)">
                            <el-icon class="file-icon" :size="32" color="#409EFF">
                                <Document />
                            </el-icon>
                            <div class="file-details">
                                <div class="file-name">{{ file.name }}</div>
                                <div class="file-meta">
                                    {{ getFileExtension(file.name) }} ·
                                    {{ formatFileSize(file.size) }}
                                </div>
                            </div>
                        </div>
                        <el-icon class="delete-icon" @click="handleDeleteFile(file.id)" :size="20" color="#909399">
                            <Delete />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// 上传文件组件
import { uploadDocument, UploadResponse } from "@/service/datasets";
import { ElMessage, UploadFile, type UploadProps, type UploadUserFile } from "element-plus";
import { ref } from "vue";

// .pdf,.doc,.docx,.txt,.html,.markdown,.md,.xls,.xlsx,.csv
const { accept } = defineProps({
    accept: {
        type: String,
        default: "*",
    },
});
const emit = defineEmits(["click", "delete"]);

//文件列表
const fileList = defineModel("fileList");
const MAX_FILE_COUNT = 10; // 最大文件数量限制

const handleUploadChange: UploadProps["onChange"] = (
    uploadFile,
    uploadFiles
) => {
    // 验证文件格式
    const type = uploadFile.name.replace(/.*\./, "");
    let regex = accept.split(",").map((x: string) => x.replace(/.*\./, ""));

    if (!regex.find((x) => x === type)) {
        ElMessage.error("文件格式错误，请上传正确的文件格式");
        uploadFiles.pop();
        return;
    }

    // 开始上传文件
    const formData = new FormData();
    formData.append("file", uploadFile.raw as File);
    uploadDocument(formData)
        .then((response) => {
            // 添加序号到响应对象
            const index = fileList.value.findIndex(file => file.name === response.name)
            fileList.value[index].id = response.id
        })
        .catch((error) => {
            ElMessage.error(`文件上传失败${error}`);
            console.error("File upload failed:", error);
        });

};


// 处理超出文件数量限制
const handleExceed: UploadProps["onExceed"] = (uploadFile, uploadFiles) => {
    console.log(uploadFile)
    const length = MAX_FILE_COUNT - uploadFiles.length;
    uploadFile.slice(0, length).forEach(file => {
        // 验证文件格式
        const type = file.name.replace(/.*\./, "");
        let regex = accept.split(",").map((x: string) => x.replace(/.*\./, ""));

        if (!regex.find((x) => x === type)) {
            ElMessage.error("文件格式错误，请上传正确的文件格式");
            return false;
        }

        // 开始上传文件
        const formData = new FormData();
        formData.append("file", file as File);
        uploadDocument(formData)
            .then((response) => {
                // 添加序号到响应对象
                fileList.value.push(response);
                // const fileWithSequence = { ...response, sequence: currentSequence };
            })
            .catch((error) => {
                ElMessage.error(`文件上传失败${error}`);
                console.error("File upload failed:", error);
            });

    })

    ElMessage.warning(
        `已达到最大文件数量限制${MAX_FILE_COUNT}个，请删除文件后再上传`
    );
};

// 点击文件名显示预览
const handleFileClick = (fileId: string) => {
    console.log('click', fileId);
    emit("click", fileId);
};

// 获取文件扩展名
const getFileExtension = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toUpperCase() || "";
    return ext;
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + sizes[i];
};

// 删除文件
const handleDeleteFile = (fileId: string) => {
    const index = fileList.value.findIndex((file) => file.id === fileId);
    if (index > -1) {
        fileList.value.splice(index, 1);
    }
};

</script>

<style scoped lang="less">
.section {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
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
</style>