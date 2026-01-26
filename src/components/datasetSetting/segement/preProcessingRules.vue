<template>
  <el-row>
    <el-col class="label ellipsis" :span="24"> 文本预处理规则 </el-col>
    <el-col :span="24">
      <el-checkbox class="custom-checkbox" v-model="pre_processing_rules[0].enabled" label="替换掉连续的空格、换行符和制表符"
        :disabled="disabled" />
    </el-col>
    <el-col :span="24">
      <el-checkbox class="custom-checkbox" v-model="pre_processing_rules[1].enabled" label="删除所有 URL 和电子邮件地址"
        :disabled="disabled" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const pre_processing_rules = defineModel("pre_processing_rules");

</script>

<style scoped lang="less">
.label {
  font-weight: 500;
  font-size: 12px;
  color: #333333;
  line-height: 20px;
  text-align: left;

}

.custom-checkbox {
  :deep(.el-checkbox__label) {
    font-size: 12px;
  }
}
</style>