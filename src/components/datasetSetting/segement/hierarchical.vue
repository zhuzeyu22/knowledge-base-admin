<template>
  <BaseCard name="父子分段" color="#FFFCF6FF" :visiable="visiable" description="使用父子模式时，子块用于检索，父块用于上下文"
    :disabled="disabled">
    <template #icon>
      <img src="@/assets/dataset-setting/parent-setting.png" width="20" alt="" />
    </template>
    <template #content>
      <div class="context">
        <el-row class="sub-title"> 父块用作上下文 </el-row>
        <BaseCard name="段落" color="#F9FBFFFF" :visiable="hierarchical.parent_mode == 'paragraph'" :show-radio="true"
          description="此模式根据分隔符和最大块长度将文本拆分为段落，使用拆分文本作为检索的父块" @selected="() => handleSelected('paragraph')">
          <template #icon>
            <img src="@/assets/dataset-setting/segement-setting.png" width="20" alt="" />
          </template>
          <template #content>
            <div class="context">
              <Segmentation v-model:segmentation="hierarchical.segmentation" :disabled="disabled"></Segmentation>
            </div>
          </template>
        </BaseCard>
        <BaseCard name="全文" color="#F9FBFFFF" :visiable="hierarchical.parent_mode == 'full-doc'" :show-radio="true"
          description="整个文档用作父块并直接检索。请注意，出于性能原因，超过10000个标记的文本将被自动截断。" :disabled="disabled"
          @selected="() => handleSelected('full-doc')">
          <template #icon>
            <img src="@/assets/dataset-setting/full-segement-setting.png" width="20" alt="" />
          </template>
        </BaseCard>
        <el-row class="sub-title"> 子块用于检索 </el-row>
        <Segmentation v-model:segmentation="hierarchical.subchunk_segmentation" :disabled="disabled"></Segmentation>
        <PreProcessingRules v-model:pre_processing_rules="hierarchical.pre_processing_rules" :disabled="disabled">
        </PreProcessingRules>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './baseCard.vue';
import PreProcessingRules from './preProcessingRules.vue';
import Segmentation from './segmentation.vue';

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
const handleSelected = (value: string) => {
  if (disabled) {
    return
  }
  return hierarchical.value.parent_mode = value;
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
</style>