<template>
  <el-row v-if="retrieval_model.reranking_enable != undefined"
    style=" width: 100%; margin-bottom: 10px; display: flex; align-items: center;">
    <el-switch v-model="retrieval_model.reranking_enable" style="margin-right: 10px" :disabled="disabled" size="small"/>
    <div class="label ellipsis">Rerank 模型</div>
  </el-row>
  <el-row v-if="retrieval_model.reranking_enable" style="width: 100%; margin-bottom: 10px">
    <el-input v-model="retrieval_model.reranking_model.reranking_model_name" disabled size="small"></el-input>
  </el-row>
</template>

<script setup lang="ts">
import { getRerankList } from '@/service/datasets';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

const rerank_model = ref("");
const rerank_model_provider = ref("");
const rerank_model_options = ref<any>([]);

const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const retrieval_model = defineModel("retrieval_model");
const getRerankModel = async () => {
  try {
    const res = await getRerankList();
    rerank_model_options.value = [];
    res.data.forEach((providerItem) => {
      providerItem.models.forEach((model) => {
        rerank_model_options.value.push({
          value: model.model,
          label: model.label.zh_Hans,
          provider: providerItem.provider,
        });
      });
    });
    if (rerank_model_options.value.length > 0) {
      rerank_model.value = rerank_model_options.value[0].value;
      rerank_model_provider.value = rerank_model_options.value[0].provider;
      // 同步初始值到 retrieval_model
      retrieval_model.value.reranking_model.reranking_model_name =
        rerank_model_options.value[0].value;
      retrieval_model.value.reranking_model.reranking_provider_name =
        rerank_model_options.value[0].provider;
    }
  } catch (error) {
    ElMessage.error("获取rerank模型选项失败");
  }
};
onMounted(() => {
  getRerankModel();
});
</script>

<style scoped lang="less">

.label {
  font-weight: 500;
  font-size: 12px;
  color: #333333;
  line-height: 20px;
  text-align: left;
}
</style>