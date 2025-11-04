<template>
  <el-row
    style="
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    "
  >
    <div class="title">文件预览</div>
  </el-row>
  <el-select
    v-model="previewFile"
    placeholder="请选择文件预览"
    style="width: 100%; margin-bottom: 10px"
    :value="previewFile"
  >
    <el-option
      v-for="value in fileList"
      :key="value.id"
      :label="value.name"
      :value="value.id"
    />
  </el-select>
  <!-- 分段内容预览 -->
  <el-card
    shadow="never"
    style="flex: 1; overflow: hidden; display: flex; flex-direction: column"
    body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;"
  >
    <div style="display: flex; flex-direction: column; gap: 16px">
      <el-card
        v-for="(segment, index) in segmentPreview"
        :key="index"
        shadow="hover"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span style="font-weight: 600">Chunk {{ index + 1 }}</span>
          <el-tag size="small" style="border: 'none'"
            >{{ segment.content?.length || 0 }} 字符</el-tag
          >
        </div>
        <div
          style="
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.6;
            font-size: 14px;
            color: #606266;
          "
        >
          {{ segment.content }}
        </div>
      </el-card>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const previewFile = defineModel("previewFile");
const segmentPreview = defineModel("segmentPreview");
// res
const fileList = defineModel("fileList");

</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}
</style>
