<template>
  <el-row style="width: 100%; margin-bottom: 10px"> 父块用作上下文 </el-row>
  <el-row style="width: 100%; margin-bottom: 10px">
    <el-card shadow="never">
      <el-collapse
        v-model="hierarchical.parent_mode"
        style="width: 100%"
        accordion
        :before-collapse="handleCollapseParentMode"
      >
        <el-collapse-item title="段落" name="paragraph">
          <el-card shadow="never">
            <div style="font-size: 12px; margin-bottom: 8px">
              此模式根据分隔符和最大块长度将文本拆分为段落，使用拆分文本作为检索的父块
            </div>
            <el-row :gutter="20">
              <el-col :span="10">分段标识符</el-col>
              <el-col :span="10">分段最大长度</el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10"
                ><el-input
                  v-model="hierarchical.segmentation.separator"
                ></el-input
              ></el-col>
              <el-col :span="10"
                ><el-input-number
                  v-model="hierarchical.segmentation.max_tokens"
                ></el-input-number
              ></el-col>
            </el-row>
          </el-card>
        </el-collapse-item>
        <el-collapse-item title="全文" name="full-doc">
          <div style="font-size: 12px">
            整个文档用作父块并直接检索。请注意，出于性能原因，超过10000个标记的文本将被自动截断。
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </el-row>
  <el-row style="width: 100%; margin-bottom: 10px"> 子块用于检索 </el-row>
  <el-row style="width: 100%; margin-bottom: 10px">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="10">分段标识符</el-col>
      <el-col :span="10">分段最大长度</el-col>
    </el-row>
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="10"
        ><el-input
          v-model="hierarchical.subchunk_segmentation.separator"
        ></el-input
      ></el-col>
      <el-col :span="10"
        ><el-input-number
          v-model="hierarchical.subchunk_segmentation.max_tokens"
        ></el-input-number
      ></el-col>
    </el-row>
  </el-row>
  <el-row style="width: 100%; margin-bottom: 10px">
    <el-col :span="24"> 文本预处理规则 </el-col>
    <el-col :span="24">
      <el-checkbox
        v-model="hierarchical.pre_processing_rules[0].enabled"
        label="替换掉连续的空格、换行符和制表符"
      />
    </el-col>
    <el-col :span="24">
      <el-checkbox
        v-model="hierarchical.pre_processing_rules[1].enabled"
        label="删除所有 URL 和电子邮件地址"
      />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const emit = defineEmits(["preview"]);
const hierarchical = defineModel("hierarchical");
const handleCollapseParentMode = (value: string) => {
  console.log(value);
  console.log("parent_mode", hierarchical.parent_mode);
  return value !== hierarchical.parent_mode;
};

// todo 这里需要补一下
const handlePreviewButton = () => {
  emit("preview");
};
</script>
