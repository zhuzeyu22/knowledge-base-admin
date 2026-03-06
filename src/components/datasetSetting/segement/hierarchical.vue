<template>
  <BaseCard name="父子分段" color="#FFFCF6FF" :visiable="visiable" description="使用父子模式时，子块用于检索，父块用于上下文" :disabled="disabled"
    @selected="handleSelected">
    <template #icon>
      <img src="@/assets/dataset-setting/parent-setting.png" width="20" alt="" />
    </template>
    <template #content>
      <div class="context">
        <el-row class="sub-title"> 父块用作上下文 </el-row>
        <BaseCard style="border-color: #f2f2f2" name="段落" color="#F9FBFFFF" :visiable="hierarchical.parent_mode == 'paragraph'" :show-radio="true"
          description="此模式根据分隔符和最大块长度将文本拆分为段落，使用拆分文本作为检索的父块" @selected="() => handleSelectedSub('paragraph')">
          <template #icon>
            <img src="@/assets/dataset-setting/segement-setting.png" width="20" alt="" />
          </template>
          <template #content>
            <div class="context">
              <Segmentation v-model:segmentation="hierarchical.segmentation" :disabled="disabled"></Segmentation>
            </div>
          </template>
        </BaseCard>
        <BaseCard style="border-color: #f2f2f2" name="全文" color="#F9FBFFFF" :visiable="hierarchical.parent_mode == 'full-doc'" :show-radio="true"
          description="整个文档用作父块并直接检索。请注意，出于性能原因，超过10000个标记的文本将被自动截断。" :disabled="disabled"
          @selected="() => handleSelectedSub('full-doc')">
          <template #icon>
            <img src="@/assets/dataset-setting/full-segement-setting.png" width="20" alt="" />
          </template>
        </BaseCard>
        <el-row class="sub-title"> 子块用于检索 </el-row>
        <Segmentation v-model:segmentation="hierarchical.subchunk_segmentation" :disabled="disabled"></Segmentation>
        <PreProcessingRules v-model:pre_processing_rules="hierarchical.pre_processing_rules" :disabled="disabled">
        </PreProcessingRules>
        <div>
<!--          <el-button type="primary" size="small" @click="handlePreviewClick">预览</el-button>-->
          <el-button class="preview-btn" size="small" @click="handlePreviewClick">
            <img src="@/assets/dataset-setting/preview.png" width="14" height="14" class="btn-icon" />
            预览
          </el-button>
          <el-button type="text" size="small"  @click="handleResetClick"
            :disabled="disabled">重置</el-button>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './baseCard.vue';
import PreProcessingRules from './preProcessingRules.vue';
import Segmentation from './segmentation.vue';

const emit = defineEmits(["selected", "preview", "reset"]);

const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  visiable: {
    type: Boolean,
    required: true,
    default: () => true,
  },
});

const hierarchical = defineModel("hierarchical");
const handleSelectedSub = (value: string) => {
  if (disabled) {
    return
  }
  return hierarchical.value.parent_mode = value;
}

const handleSelected = () => {
  emit("selected");
}
const handlePreviewClick = () => {
  emit("preview");
}

const handleResetClick = () => {
  emit("reset");
}
</script>

<style scoped lang="less">
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 0;
}

.context {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sub-title {
  font-size: 12px;
  font-weight: bold;
}
.preview-btn {
  background-color: #ffffff;
  color: var(--el-color-primary);
  padding: 4px 6px;
  border-radius: 4px;
  &:hover {
    background-color: rgba(81, 105, 240, 0.1);
  }
}
.btn-icon {
  margin-right: 4px;
  vertical-align: middle;
}
</style>
