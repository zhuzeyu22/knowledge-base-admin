<template>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-row class="label ellipsis">Top K</el-row>
      <el-row>
        <el-input-number v-model="retrieval_model.top_k" :min="1" :max="10" :step="1" :disabled="disabled" size="small"
          controls-position="right" />
      </el-row>
      <el-row>
        <el-slider class="slider-style" v-model="retrieval_model.top_k" size="small" :min="1" :max="10" :step="1"
          :disabled="disabled" />
      </el-row>
    </el-col>
    <el-col :span="8">
      <el-row class="label ellipsis score">
        <el-switch v-model="retrieval_model.score_threshold_enabled" :disabled="disabled" size="small" />
        <div>Score 阈值</div>
      </el-row>
      <el-row>
        <el-input-number v-model="retrieval_model.score_threshold" :disabled="!retrieval_model.score_threshold_enabled || disabled
          " :min="0" :max="1" :step="0.01" controls-position="right" size="small" />
      </el-row>
      <el-row>
        <el-slider class="slider-style" v-model="retrieval_model.score_threshold" size="small" :disabled="!retrieval_model.score_threshold_enabled || disabled
          " :min="0" :max="1" :step="0.01" />
      </el-row>
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

const retrieval_model = defineModel("retrieval_model");

</script>

<style scoped lang="less">
.label {
  font-weight: 500;
  font-size: 12px;
  color: #333333;
  line-height: 24px;
  text-align: left;
}
.score {
  gap: 4px;
  flex-wrap: nowrap;
}
</style>