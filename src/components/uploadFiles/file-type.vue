<template>
  <section class="section">
    <div class="title">
      文件类型
    </div>
    <div class="type-row">
      <div class="type-col">
        <button :class="radio === UploadFileIs.datasets ? 'upload border' : 'upload'"
          @click="radio = UploadFileIs.datasets">
          <img src="@/assets/dataset-setting/upload-doc.png" alt="">
          <div class="upload-text">文档上传</div>
        </button>
      </div>
      <div class="type-col">
        <button :class="radio === UploadFileIs.qa_pairs ? 'upload border' : 'upload'"
          @click="radio = UploadFileIs.qa_pairs">
          <img src="@/assets/dataset-setting/upload-qa.png" alt="">
          <div class="upload-text">问答对上传</div>
          <div  class="template-link">
            <a href="/template/QA.xlsx" class="down-tpl" download="QA模板.xlsx">下载模板</a>
          </div>
        </button>
      </div>
    </div>
    <div class="title">
      上传文件{{radio}}      {{UploadFileIs.datasets}}
    </div>
    <el-row class="file-tips">
      {{ `支持 ${radio === 'datasets' ? "DOC、DOCX、TXT、PDF、HTML、MARKDOWN、PPTX、" : ''}XLSX、XLS、CSV
      文件格式，最大上传文件数量为10个，单个文件大小不超过 40MB` }}
    </el-row>
  </section>
</template>

<script setup lang="ts">
import { UploadFileIs } from "@/models/dataset";
const radio = defineModel<UploadFileIs>("radio");

</script>

<style scoped lang="less">
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  width: 490px;
}

.title {
  font-size: 14px;
  line-height: 1.2;
  font-weight: bold;
  padding-bottom: 14px;
}
.type-row {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 16px;
}

.type-col {
  width: 237px;
  flex-shrink: 0;
}
.file-tips {
  font-size: 12px;
  line-height: 1.2;
  color: #455166;
  padding-bottom: 8px;
}
.upload-text {
  font-size: 16px;
}

.template-link {
  margin-left: auto;
  font-size: 14px;
  color: #455166;
}
.upload {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #e2e2e2;
  background-color: transparent;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(81, 105, 240, 0.05);
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

}
.border {
  border: 1px solid var(--el-color-primary);
  background-color: rgba(81, 105, 240, 0.1);
}
  .down-tpl{
    font-size: 12px;
    font-weight: 400;
    color: #455166;
    line-height: 20px;
  }
.down-tpl:hover{
  color: var(--el-color-primary);
}
</style>
