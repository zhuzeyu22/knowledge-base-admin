<template>
  <BaseCard name="全文检索" color="#F6FEFFFF" :visiable="visiable" description="索引文档中的所有词汇，从而允许用户查询任意词汇，并返回包含这些词汇的文本片段"
    :disabled="disabled" @selected="handleSelected">
    <template #icon>
      <img src="@/assets/dataset-setting/full-text-search.png" width="20" alt="" />
    </template>
    <template #content>
      <div class="context">
        <Rerank :disabled="disabled" v-model:retrieval_model="retrieval_model" />
        <RerankConfig :disabled="disabled" v-model:retrieval_model="retrieval_model" />
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './baseCard.vue';
import Rerank from './rerank.vue';
import RerankConfig from './rerankConfig.vue';

const emit = defineEmits(["selected"]);

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

const retrieval_model = defineModel("retrieval_model");

const handleSelected = () => {
  emit("selected");
}

</script>

<style scoped lang="less">
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.context {
  padding: 12px 16px;
}
</style>