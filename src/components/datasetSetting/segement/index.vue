<template>
  <div class="title">分段设置</div>
  <el-card shadow="never">
    <el-collapse
      v-model="process_rule"
      accordion
      :before-collapse="handleCollapseProcessRule"
    >
      <el-collapse-item v-if="custom != null" title="通用" name="custom">
        <Custom v-model:custom="custom" @preview="handlePreviewButton"></Custom>
      </el-collapse-item>
      <el-collapse-item
        v-if="hierarchical != null"
        title="父子分段"
        name="hierarchical"
      >
        <hierarchical
          v-model:hierarchical="hierarchical"
          @preview="handlePreviewButton"
        ></hierarchical>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup lang="ts">
import Custom from "./custom.vue";
import Hierarchical from "./hierarchical.vue";

const emit = defineEmits(["preview"]);
const process_rule = defineModel("process_rule");
const custom = defineModel("custom");
const hierarchical = defineModel("hierarchical");

// const process_rule = ref("custom");
// const custom = ref({
//   pre_processing_rules: [
//     {
//       id: "remove_extra_spaces",
//       enabled: false,
//     },
//     {
//       id: "remove_urls_emails",
//       enabled: false,
//     },
//   ],
//   segmentation: {
//     separator: "\\n\\n",
//     max_tokens: 500,
//     chunk_overlap: 50,
//   },
// });

// const hierarchical = ref({
//   parent_mode: "paragraph",
//   pre_processing_rules: [
//     {
//       id: "remove_extra_spaces",
//       enabled: false,
//     },
//     {
//       id: "remove_urls_and_emails",
//       enabled: false,
//     },
//   ],
//   segmentation: {
//     separator: "\\n\\n",
//     max_tokens: 500,
//   },
//   subchunk_segmentation: {
//     separator: "\\n\\n",
//     max_tokens: 500,
//   },
// });

const handleCollapseProcessRule = (value: string) => {
  return value !== process_rule.value;
};

const handlePreviewButton = () => {
  emit("preview");
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}
</style>
