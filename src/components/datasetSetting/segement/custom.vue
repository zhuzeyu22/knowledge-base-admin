<template>
  <BaseCard name="通用设置" color="#F8FAFFFF" :visiable="visiable" description="通用文本分块模式，检索和召回的块是相同的" :disabled="disabled"
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
        <el-row>
          <el-button size="small" style="color: skyblue" @click="handlePreviewClick">预览</el-button>
          <el-button size="small" style="border: none; color: black" @click="handleResetClick"
            :disabled="disabled">重置</el-button>
        </el-row>
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
</style>