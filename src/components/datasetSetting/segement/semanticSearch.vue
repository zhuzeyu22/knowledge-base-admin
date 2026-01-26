<template>
  <BaseCard name="向量检索" color="#F6FFF7FF" :visiable="visiable" description="通过生成查询嵌入并查询与其向量表示最相似的文本分段"
    :disabled="disabled" @selected="handleSelected">
    <template #icon>
      <img src="@/assets/dataset-setting/semantic-search.png" width="20" alt="" />
    </template>
    <template v-if="visiable" #content>
      <div class="context">
        <Rerank v-model:retrieval_model="retrieval_model" />
        <RerankConfig v-model:retrieval_model="retrieval_model" />
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
  flex: 0;
}

.context {
  padding: 12px 16px;
}

</style>