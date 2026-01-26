<template>
  <BaseCard name="向量检索" color="#f5f5f5" :visiable="visiable" description="通过生成查询嵌入并查询与其向量表示最相似的文本分段"
    :disabled="disabled">
    <template #icon>
      <img src="@/assets/dataset-setting/semantic-search.png" width="20" alt="" />
    </template>
    <template #content>
      <Rerank :disabled="disabled" v-model:retrieval_model="retrieval_model" />
      <RerankConfig :disabled="disabled" v-model:retrieval_model="retrieval_model" />
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './baseCard.vue';
import Rerank from './rerank.vue';

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

</script>

<style scoped lang="less">
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>>