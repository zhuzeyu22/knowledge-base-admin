<template>
  <section class="section">
    <el-row style="display: flex;align-items: center; margin-bottom: 10px" :gutter="10">
      <el-col :span="12">
        <button :class="radio == 'datasets' ? 'upload border' : 'upload'" @click="radio = 'datasets'">
          <img src="@/assets/dataset-setting/upload-doc.png" alt="">
          <div>文档上传</div>
        </button>
      </el-col>
      <el-col :span="12">
        <button :class="radio == 'qa_pairs' ? 'upload border' : 'upload'" @click="radio = 'qa_pairs'">
          <img src="@/assets/dataset-setting/upload-qa.png" alt="">
          <div>问答对上传</div>
          <div style="margin-left: auto; font-size: 10px; color: #409eff;">
            <a href="/template/QA.xlsx" download="QA模板.xlsx">下载模板</a>
          </div>
        </button>
      </el-col>
    </el-row>
    <el-row style="padding: 10px; font-size: 12px; min-height: 56px;">
      {{ `支持 ${radio === 'datasets' ? "DOC、DOCX、TXT、PDF、HTML、MARKDOWN、" : ''}XLSX、XLS、CSV
      文件格式，最大上传文件数量为10个，单个文件大小不超过 40MB` }}
    </el-row>
  </section>
</template>

<script setup lang="ts">
const radio = defineModel("radio");

</script>

<style scoped lang="less">
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.border {
  border: 1px solid #dcdfe6;
}

.border:hover {
  border-color: #646cff;
}

.upload {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  font-size: 12px;

  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  a:hover {
    text-decoration: underline;
  }
}
</style>