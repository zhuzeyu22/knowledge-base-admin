<template>
  <el-row :gutter="20">
    <el-col :span="8">分段标识符</el-col>
    <el-col :span="8">分段最大长度</el-col>
    <el-col :span="8">分段重叠长度</el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-input v-model="custom.segmentation.separator" :disabled="disabled"></el-input>
    </el-col>
    <el-col :span="8">
      <el-input-number v-model="custom.segmentation.max_tokens" :min="50"
        :disabled="disabled"></el-input-number>
      </el-col>
    <el-col :span="8">
      <el-input-number v-model="custom.segmentation.chunk_overlap" :min="50"
        :disabled="disabled"></el-input-number>
      </el-col>
  </el-row>
  <el-row>
    <el-col :span="24"> 文本预处理规则 </el-col>
    <el-col :span="24">
      <el-checkbox v-model="custom.pre_processing_rules[0].enabled" label="替换掉连续的空格、换行符和制表符" :disabled="disabled" />
    </el-col>
    <el-col :span="24">
      <el-checkbox v-model="custom.pre_processing_rules[1].enabled" label="删除所有 URL 和电子邮件地址" :disabled="disabled" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <el-button style="color: skyblue" @click="handlePreviewButton">预览</el-button>
    </el-col>
    <el-col :span="8">
      <el-button style="border: none; color: black" @click="handleReset" :disabled="disabled">重置</el-button>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const emit = defineEmits(["preview", "reset"]);
const custom = defineModel("custom");
const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const handlePreviewButton = () => {
  emit("preview");
};

const handleReset = () => {
  custom.value.segmentation.max_tokens = 500
  custom.value.segmentation.chunk_overlap = 50
  emit("reset");
}
</script>
