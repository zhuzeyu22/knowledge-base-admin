<template>
  <BaseCard name="混合检索" color="#F9F6FFFF" :visiable="visiable"
    description="同时执行全文检索和向量检索，并应用重排序步骤，从两类查询结果中选择匹配用户问题的最佳结果，用户可以选择设置权重或配置重新排序模型。" :disabled="disabled"
    @selected="handleSelected">
    <template #icon>
      <img src="@/assets/dataset-setting/full-text-search.png" width="20" alt="" />
    </template>
    <template #content>
      <div class="context">
        <el-row :gutter="10">
          <el-col :span="12">
            <BaseCard style="height: 100%;" name="权重设置" color="#F9FBFFFF"
              :visiable="retrieval_model.reranking_mode == 'weighted_score'" :show-radio="true"
              description="通过调整分配的权重，重新排序策略确定是优先进行语义匹配还是关键字匹配。"
              @selected="() => handleSelectedreRankingMode('weighted_score')">
              <template #icon>
                <img src="@/assets/dataset-setting/parent-setting.png" width="20" alt="" />
              </template>
            </BaseCard>
          </el-col>
          <el-col :span="12">
            <BaseCard style="height: 100%;" name="Rerank 模型" color="#F9FBFFFF"
              :visiable="retrieval_model.reranking_mode == 'reranking_model'" :show-radio="true"
              description="重排序模型将根据候选文档列表与用户问题语义匹配度进行重新排序，从而改进语义排序的结果" :disabled="disabled"
              @selected="() => handleSelectedreRankingMode('reranking_model')">
              <template #icon>
                <img src="@/assets/dataset-setting/rerank-model.png" width="20" alt="" />
              </template>
            </BaseCard>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-slider v-model="retrieval_model.weights.keyword_setting.keyword_weight
            " @change="handleWeightChange" :min="0" :max="1" :step="0.1" :disabled="disabled" />
          <el-col class="label ellipsis" :span="12">语义 {{ retrieval_model.weights.keyword_setting.keyword_weight
          }}</el-col>
          <el-col class="label ellipsis last" :span="12">{{ retrieval_model.weights.vector_setting.vector_weight
          }} 关键词</el-col>
        </el-row>
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
const handleWeightChange = (value) => {
  retrieval_model.value.weights.vector_setting.vector_weight = Number((1 - value).toFixed(1))
}

const handleSelected = () => {
  emit("selected");
}

const handleSelectedreRankingMode = (reranking_mode: string) => {
  retrieval_model.value.reranking_mode = reranking_mode
}
</script>

<style scoped lang="less">
.context {
  padding: 12px 16px;
}

.label {
  font-weight: 500;
  font-size: 12px;
  color: #333333;
  line-height: 20px;
  text-align: left;
  font-weight: 500;
  color: #333333;
  font-style: normal;
}

.last {
  text-align: right;
}
</style>