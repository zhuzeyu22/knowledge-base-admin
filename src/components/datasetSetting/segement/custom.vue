<template>
  <BaseCard name="通用设置" color="#F8FAFF" :visiable="visiable" description="通用文本分块模式，检索和召回的块是相同的" :disabled="disabled"
    @selected="handleSelected">
    <template #icon>
      <img src="@/assets/dataset-setting/custom-setting.png" width="20" alt="" />
    </template>
    <template v-if="visiable" #content>
      <div class="context">
        <Segmentation class="segmentation" v-model:segmentation="custom.segmentation" :disabled="disabled">
        </Segmentation>
        <PreProcessingRules v-model:pre_processing_rules="custom.pre_processing_rules" :disabled="disabled">
        </PreProcessingRules>
        <div style="padding-top: 20px">
          <el-button class="preview-btn"  size="small"  @click="handlePreviewClick">
            <img src="@/assets/dataset-setting/preview.png" width="14" height="14" class="btn-icon" />
            预览</el-button>
          <el-button  size="small" type="text" @click="handleResetClick"
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

const { disabled, visiable } = defineProps({
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

const custom = defineModel("custom");
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
}

.segmentation {
  margin-bottom: 10px;
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
