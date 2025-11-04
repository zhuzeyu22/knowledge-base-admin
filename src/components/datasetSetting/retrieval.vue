<template>
  <div class="title">检索设置</div>
  <el-card shadow="never">
    <el-collapse
      v-model="retrieval_model.search_method"
      accordion
      :before-collapse="handleCollapseSearchMethod"
      :disabled="disabled"
    >
      <el-collapse-item title="向量检索" name="semantic_search">
        <el-row style="width: 100%; margin-bottom: 10px">
          通过生成查询嵌入并查询与其向量表示最相似的文本分段
        </el-row>
        <el-card shadow="never">
          <el-row
            style="
              width: 100%;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
            "
          >
            <el-switch
              v-model="retrieval_model.reranking_enable"
              style="margin-right: 10px"
              :disabled="disabled"
            />
            <div>Rerank 模型</div>
          </el-row>
          <el-row
            v-if="retrieval_model.reranking_enable"
            style="width: 100%; margin-bottom: 10px"
          >
            <el-input
              v-model="retrieval_model.reranking_model.reranking_model_name"
              disabled
            ></el-input>
          </el-row>
          <el-row>
            <el-row style="width: 100%" :gutter="20">
              <el-col :span="12">Top K</el-col>
              <el-col :span="12">
                <el-switch
                  v-model="retrieval_model.score_threshold_enabled"
                  :disabled="disabled"
                />
                Score 阈值
              </el-col>
            </el-row>
            <el-row style="width: 100%" :gutter="20">
              <el-col :span="12">
                <el-input-number
                  v-model="retrieval_model.top_k"
                  :min="1"
                  :max="10"
                  :step="1"
                  :disabled="disabled"
                />
                <el-slider
                  class="slider-style"
                  v-model="retrieval_model.top_k"
                  size="small"
                  :min="1"
                  :max="10"
                  :step="1"
                  :disabled="disabled"
                />
              </el-col>
              <el-col :span="12">
                <el-input-number
                  v-model="retrieval_model.score_threshold"
                  :disabled="
                    !retrieval_model.score_threshold_enabled || disabled
                  "
                  :min="0"
                  :max="1"
                  :step="0.01"
                />
                <el-slider
                  class="slider-style"
                  v-model="retrieval_model.score_threshold"
                  size="small"
                  :disabled="
                    !retrieval_model.score_threshold_enabled || disabled
                  "
                  :min="0"
                  :max="1"
                  :step="0.01"
                />
              </el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="全文检索" name="full_text_search">
        <el-row style="width: 100%; margin-bottom: 10px">
          索引文档中的所有词汇，从而允许用户查询任意词汇，并返回包含这些词汇的文本片段
        </el-row>
        <el-card shadow="never">
          <el-row
            style="
              width: 100%;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
            "
          >
            <el-switch
              v-model="retrieval_model.reranking_enable"
              style="margin-right: 10px"
              :disabled="disabled"
            />
            <div>Rerank 模型</div>
          </el-row>
          <el-row
            v-if="retrieval_model.reranking_enable"
            style="width: 100%; margin-bottom: 10px"
          >
            <el-input
              v-model="retrieval_model.reranking_model.reranking_model_name"
              disabled
            ></el-input>
          </el-row>
          <el-row>
            <el-row style="width: 100%" :gutter="20">
              <el-col :span="12">Top K</el-col>
              <el-col :span="12">
                <el-switch
                  v-model="retrieval_model.score_threshold_enabled"
                  :disabled="disabled"
                />
                Score 阈值
              </el-col>
            </el-row>
            <el-row style="width: 100%" :gutter="20">
              <el-col :span="12">
                <el-input-number
                  v-model="retrieval_model.top_k"
                  :min="1"
                  :max="10"
                  :step="1"
                  :disabled="disabled"
                />
                <el-slider
                  class="slider-style"
                  v-model="retrieval_model.top_k"
                  size="small"
                  :min="1"
                  :max="10"
                  :step="1"
                  :disabled="disabled"
                />
              </el-col>
              <el-col :span="12">
                <el-input-number
                  v-model="retrieval_model.score_threshold"
                  :disabled="
                    !retrieval_model.score_threshold_enabled || disabled
                  "
                  :min="0"
                  :max="1"
                  :step="0.01"
                />
                <el-slider
                  class="slider-style"
                  v-model="retrieval_model.score_threshold"
                  size="small"
                  :disabled="
                    !retrieval_model.score_threshold_enabled || disabled
                  "
                  :min="0"
                  :max="1"
                  :step="0.01"
                />
              </el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="混合检索" name="hybrid_search">
        <el-row style="width: 100%; margin-bottom: 10px">
          同时执行全文检索和向量检索，并应用重排序步骤，从两类查询结果中选择匹配用户问题的最佳结果，用户可以选择设置权重或配置重新排序模型。
        </el-row>
        <el-row>
          <el-tabs
            v-model="retrieval_model.reranking_mode"
            type="border-card"
            :disabled="disabled"
          >
            <el-tab-pane name="weighted_score" label="权重设置">
              <div>
                通过调整分配的权重，重新排序策略确定是优先进行语义匹配还是关键字匹配。
              </div>
              <el-row style="margin-bottom: 10px">
                <el-slider
                  v-model="
                    retrieval_model.weights.keyword_setting.keyword_weight
                  "
                  :onchange="
                    (retrieval_model.weights.vector_setting.vector_weight =
                      Number(
                        (
                          1 -
                          retrieval_model.weights.keyword_setting.keyword_weight
                        ).toFixed(1)
                      ))
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  :disabled="disabled"
                />
                <el-col :span="12"
                  >语义{{
                    retrieval_model.weights.keyword_setting.keyword_weight
                  }}</el-col
                >
                <el-col :span="12"
                  >{{
                    retrieval_model.weights.vector_setting.vector_weight
                  }}关键词</el-col
                >
              </el-row>
              <el-row
                v-if="retrieval_model.reranking_enable"
                style="width: 100%; margin-bottom: 10px"
              >
                <el-input
                  v-model="retrieval_model.reranking_model.reranking_model_name"
                  disabled
                ></el-input>
              </el-row>
              <el-row>
                <el-row style="width: 100%" :gutter="20">
                  <el-col :span="12">Top K</el-col>
                  <el-col :span="12">
                    <el-switch
                      v-model="retrieval_model.score_threshold_enabled"
                      :disabled="disabled"
                    />
                    Score 阈值
                  </el-col>
                </el-row>
                <el-row style="width: 100%" :gutter="20">
                  <el-col :span="12">
                    <el-input-number
                      v-model="retrieval_model.top_k"
                      :min="1"
                      :max="10"
                      :step="1"
                      :disabled="disabled"
                    />
                    <el-slider
                      class="slider-style"
                      v-model="retrieval_model.top_k"
                      size="small"
                      :min="1"
                      :max="10"
                      :step="1"
                    />
                  </el-col>
                  <el-col :span="12">
                    <el-input-number
                      v-model="retrieval_model.score_threshold"
                      :disabled="
                        !retrieval_model.score_threshold_enabled || disabled
                      "
                      :min="0"
                      :max="1"
                      :step="0.01"
                    />
                    <el-slider
                      class="slider-style"
                      v-model="retrieval_model.score_threshold"
                      size="small"
                      :disabled="
                        !retrieval_model.score_threshold_enabled || disabled
                      "
                      :min="0"
                      :max="1"
                      :step="0.01"
                    />
                  </el-col>
                </el-row>
              </el-row>
            </el-tab-pane>
            <el-tab-pane name="reranking_model" label="Rerank 模型">
              <div>
                重排序模型将根据候选文档列表与用户问题语义匹配度进行重新排序，从而改进语义排序的结果
              </div>

              <el-row
                style="
                  width: 100%;
                  margin-bottom: 10px;
                  display: flex;
                  align-items: center;
                "
              >
                <el-switch
                  v-model="retrieval_model.reranking_enable"
                  style="margin-right: 10px"
                  :disabled="disabled"
                />
                <div>Rerank 模型</div>
              </el-row>
              <el-row
                v-if="retrieval_model.reranking_enable"
                style="width: 100%; margin-bottom: 10px"
              >
                <el-input
                  v-model="retrieval_model.reranking_model_name"
                  disabled
                ></el-input>
              </el-row>
              <el-row>
                <el-row style="width: 100%" :gutter="20">
                  <el-col :span="12">Top K</el-col>
                  <el-col :span="12">
                    <el-switch
                      v-model="retrieval_model.score_threshold_enabled"
                      :disabled="disabled"
                    />
                    Score 阈值
                  </el-col>
                </el-row>
                <el-row style="width: 100%" :gutter="20">
                  <el-col :span="12">
                    <el-input-number
                      v-model="retrieval_model.top_k"
                      :min="1"
                      :max="10"
                      :step="1"
                      :disabled="disabled"
                    />
                    <el-slider
                      class="slider-style"
                      v-model="retrieval_model.top_k"
                      size="small"
                      :min="1"
                      :max="10"
                      :step="1"
                      :disabled="disabled"
                    />
                  </el-col>
                  <el-col :span="12">
                    <el-input-number
                      v-model="retrieval_model.score_threshold"
                      :disabled="
                        !retrieval_model.score_threshold_enabled || disabled
                      "
                      :min="0"
                      :max="1"
                      :step="0.01"
                    />
                    <el-slider
                      class="slider-style"
                      v-model="retrieval_model.score_threshold"
                      size="small"
                      :disabled="
                        !retrieval_model.score_threshold_enabled || disabled
                      "
                      :min="0"
                      :max="1"
                      :step="0.01"
                    />
                  </el-col>
                </el-row>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup lang="ts">
const retrieval_model = defineModel("retrieval_model");
const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    defaulel: false,
  },
});

const handleCollapseSearchMethod = (value: string) => {
  return value !== retrieval_model.search_method;
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}
</style>
