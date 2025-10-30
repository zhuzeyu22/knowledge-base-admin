<template>
    <el-upload v-model:file-list="fileList" style="width: 100%;" drag :auto-upload="false"
        accept=".pkg" action="" :limit="10"
        :on-change="handleUploadChange" multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            <el-col>
                <el-button type="primary" size="small">选择文件上传</el-button>
            </el-col>
            <el-col style="margin-top: 10px;"> 或将文件拖拽到此处</el-col>
        </div>
    </el-upload>
</template>

<script setup lang="ts">
import { installPlugin, uploadPlugin } from '@/service/datasets'
import router from '@/router';
import { ref } from 'vue'
import { UploadFilled, Back } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { initDataset, uploadDocument, UploadResponse } from '@/service/datasets';

const fileList = ref<UploadUserFile[]>([])

const unique_identifier = ref<string>('')

const handleUploadChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    const formData = new FormData()
    if (uploadFile.raw) {
        formData.append('pkg', uploadFile.raw)
        uploadPlugin(formData).then(response => {
            console.log('Plugin uploaded successfully:', response)
            unique_identifier.value = response.unique_identifier
            installPlugin({ plugin_unique_identifiers: [unique_identifier.value] }).then(res => {
                console.log('Plugin install successfully:', res)
            }).catch(error => {
                console.error('Plugin install failed:', error)
            })
        }).catch(error => {
            console.error('Plugin upload failed:', error)
        })
    }
}




</script>