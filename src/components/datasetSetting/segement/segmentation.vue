<template>
  <el-row :gutter="8">
    <el-col :span="8">
      <div class="label ellipsis">分段标识符</div>
      <el-input class="auto-width-input" v-model="segmentation.separator" :disabled="disabled" size="small"></el-input>
    </el-col>
    <el-col :span="8">
      <div class="label ellipsis">分段最大长度</div>
      <el-input-number class="full-width-input" v-model="segmentation.max_tokens" :min="50" :disabled="disabled" size="small"
        controls-position="right"></el-input-number>
    </el-col>
    <el-col v-if="segmentation?.chunk_overlap !== undefined" :span="8">
      <div class="label ellipsis">分段重叠长度</div>
      <el-input-number class="full-width-input" v-model="segmentation.chunk_overlap" :min="50" :disabled="disabled" size="small"
        controls-position="right"></el-input-number>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const segmentation = defineModel("segmentation");

</script>

<style scoped lang="less">
.label {
  font-weight: 500;
  font-size: 12px;
  color: #333333;
  line-height: 20px;
  text-align: left;
}

.auto-width-input {
  :deep(.el-input__wrapper) {
    width: 100%;
  }
}

.full-width-input {
  width: 100%;
  :deep(.el-input__wrapper) {
    width: 100%;
  }
}
</style>