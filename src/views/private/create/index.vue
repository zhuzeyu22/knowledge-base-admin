<template>
  <el-container class="content-container">
    <el-header class="header-style">
      <el-button type="primary" link size="default" @click="router.back()" style="padding: 0; margin-right: 16px">
        <el-icon>
          <Back />
        </el-icon>
      </el-button>
      <div>创建知识库</div>
    </el-header>
    <el-main v-if="step !== 3" class="context-style" style="overflow: auto">
      <el-card class="wapper-style" body-style="height: 100%; display: flex; flex-direction: row;">
        <el-col :span="11" style="display: flex; flex-direction: column">
          <div v-if="step === 1" style="flex-grow: 1">
            <el-row>
              <el-row style="display: flex;align-items: center; margin-bottom: 10px">
                <el-radio-group v-model="radio" text-color="#626aef" fill="rgb(239, 240, 253)">
                  <el-radio-button label="文档上传" value="datasets" />
                  <el-radio-button label="问答对上传" value="qa_pairs" />
                </el-radio-group>
                <div style="margin-left: 8px; font-size: 14px; color: #409eff;">
                  <a href="/template/QA.xlsx" download="QA模板.xlsx">下载模板</a>
                </div>
              </el-row>
              <div style="padding: 10px; font-size: 14px">
                {{ `支持 ${radio === 'datasets' ? "DOC、DOCX、TXT、PDF、HTML、MARKDOWN" : ''}XLSX、XLS、、CSV
                文件格式，最大上传文件数量为10个，单个文件大小不超过 40MB` }}
              </div>
            </el-row>
            <UploadFiles :fileList="fileList" :accept="accept" @click="handleFileClick"></UploadFiles>
          </div>
          <div v-else-if="step === 2" style="flex-grow: 1; overflow-y: auto">
            <el-col style="margin-bottom: 10px">
              <div class="title">分段设置</div>
              <el-card shadow="never">
                <el-collapse v-model="process_rule" accordion :before-collapse="handleCollapseProcessRule"
                  :disabled="radio == 'qa_pairs'">
                  <el-collapse-item title="通用" name="custom">
                    <el-row :gutter="20">
                      <el-col :span="8">分段标识符</el-col>
                      <el-col :span="8">分段最大长度</el-col>
                      <el-col :span="8">分段重叠长度</el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8"><el-input v-model="custom.segmentation.separator"
                          :disabled="radio == 'qa_pairs'"></el-input></el-col>
                      <el-col :span="8"><el-input-number v-model="custom.segmentation.max_tokens"
                          :disabled="radio == 'qa_pairs'" :min="50"></el-input-number></el-col>
                      <el-col :span="8"><el-input-number v-model="custom.segmentation.chunk_overlap"
                          :disabled="radio == 'qa_pairs'" :min="50"></el-input-number></el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24"> 文本预处理规则 </el-col>
                      <el-col :span="24">
                        <el-checkbox v-model="custom.pre_processing_rules[0].enabled" label="替换掉连续的空格、换行符和制表符"
                          :disabled="radio == 'qa_pairs'" />
                      </el-col>
                      <el-col :span="24">
                        <el-checkbox v-model="custom.pre_processing_rules[1].enabled" label="删除所有 URL 和电子邮件地址"
                          :disabled="radio == 'qa_pairs'" />
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <el-button style="color: skyblue" @click="handlePreviewButton">预览</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button style="border: none; color: black" :disabled="radio == 'qa_pairs'">重置</el-button>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="父子分段" name="hierarchical">
                    <el-row style="width: 100%; margin-bottom: 10px">
                      父块用作上下文
                    </el-row>
                    <el-row style="width: 100%; margin-bottom: 10px">
                      <el-card shadow="never">
                        <el-collapse v-model="hierarchical.parent_mode" style="width: 100%" accordion
                          :before-collapse="handleCollapseParentMode">
                          <el-collapse-item title="段落" name="paragraph">
                            <el-card shadow="never">
                              <div style="font-size: 12px; margin-bottom: 8px">
                                此模式根据分隔符和最大块长度将文本拆分为段落，使用拆分文本作为检索的父块
                              </div>
                              <el-row :gutter="20">
                                <el-col :span="10">分段标识符</el-col>
                                <el-col :span="10">分段最大长度</el-col>
                              </el-row>
                              <el-row :gutter="20">
                                <el-col :span="10"><el-input v-model="hierarchical.segmentation.separator
                                  "></el-input></el-col>
                                <el-col :span="10"><el-input-number v-model="hierarchical.segmentation.max_tokens
                                  " :min="50"></el-input-number></el-col>
                              </el-row>
                            </el-card>
                          </el-collapse-item>
                          <el-collapse-item title="全文" name="full-doc">
                            <div style="font-size: 12px">
                              整个文档用作父块并直接检索。请注意，出于性能原因，超过10000个标记的文本将被自动截断。
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                      </el-card>
                    </el-row>
                    <el-row style="width: 100%; margin-bottom: 10px">
                      子块用于检索
                    </el-row>
                    <el-row style="width: 100%; margin-bottom: 10px">
                      <el-row :gutter="20" style="width: 100%">
                        <el-col :span="10">分段标识符</el-col>
                        <el-col :span="10">分段最大长度</el-col>
                      </el-row>
                      <el-row :gutter="20" style="width: 100%">
                        <el-col :span="10"><el-input v-model="hierarchical.subchunk_segmentation.separator
                          "></el-input></el-col>
                        <el-col :span="10"><el-input-number v-model="hierarchical.subchunk_segmentation.max_tokens
                          " :min="50"></el-input-number></el-col>
                      </el-row>
                    </el-row>
                    <el-row style="width: 100%; margin-bottom: 10px">
                      <el-col :span="24"> 文本预处理规则 </el-col>
                      <el-col :span="24">
                        <el-checkbox v-model="hierarchical.pre_processing_rules[0].enabled" label="替换掉连续的空格、换行符和制表符" />
                      </el-col>
                      <el-col :span="24">
                        <el-checkbox v-model="hierarchical.pre_processing_rules[1].enabled" label="删除所有 URL 和电子邮件地址" />
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </el-col>
            <el-col style="margin-bottom: 10px">
              <div class="title">Embedding 模型</div>
              <el-select v-model="embedding_model" @change="handleEmbeddingModelChange" disabled>
                <el-option v-for="item in embedding_model_options" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col style="margin-bottom: 10px">
              <div class="title">检索设置</div>
              <el-card shadow="never">
                <el-collapse v-model="retrieval_model.search_method" accordion
                  :before-collapse="handleCollapseSearchMethod">
                  <el-collapse-item title="向量检索" name="semantic_search">
                    <el-row style="width: 100%; margin-bottom: 10px">
                      通过生成查询嵌入并查询与其向量表示最相似的文本分段
                    </el-row>
                    <el-card shadow="never">
                      <el-row style="
                          width: 100%;
                          margin-bottom: 10px;
                          display: flex;
                          align-items: center;
                        ">
                        <el-switch v-model="retrieval_model.reranking_enable" style="margin-right: 10px" />
                        <div>Rerank 模型</div>
                      </el-row>
                      <el-row v-if="retrieval_model.reranking_enable" style="width: 100%; margin-bottom: 10px">
                        <el-select v-model="rerank_model" @change="handleRerankModelChange" disabled>
                          <el-option v-for="item in rerank_model_options" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-row>
                      <el-row>
                        <el-row style="width: 100%" :gutter="20">
                          <el-col :span="12">Top K</el-col>
                          <el-col :span="12">
                            <el-switch v-model="retrieval_model.score_threshold_enabled" />
                            Score 阈值
                          </el-col>
                        </el-row>
                        <el-row style="width: 100%" :gutter="20">
                          <el-col :span="12">
                            <el-input-number v-model="retrieval_model.top_k" :min="1" :max="10" :step="1" />
                            <el-slider class="slider-style" v-model="retrieval_model.top_k" size="small" :min="1"
                              :max="10" :step="1" />
                          </el-col>
                          <el-col :span="12">
                            <el-input-number v-model="retrieval_model.score_threshold" :disabled="!retrieval_model.score_threshold_enabled
                              " :min="0" :max="1" :step="0.01" />
                            <el-slider class="slider-style" v-model="retrieval_model.score_threshold" size="small"
                              :disabled="!retrieval_model.score_threshold_enabled
                                " :min="0" :max="1" :step="0.01" />
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
                      <el-row style="
                          width: 100%;
                          margin-bottom: 10px;
                          display: flex;
                          align-items: center;
                        ">
                        <el-switch v-model="retrieval_model.reranking_enable" style="margin-right: 10px" />
                        <div>Rerank 模型</div>
                      </el-row>
                      <el-row v-if="retrieval_model.reranking_enable" style="width: 100%; margin-bottom: 10px">
                        <el-select v-model="rerank_model" @change="handleRerankModelChange" disabled>
                          <el-option v-for="item in rerank_model_options" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-row>
                      <el-row>
                        <el-row style="width: 100%" :gutter="20">
                          <el-col :span="12">Top K</el-col>
                          <el-col :span="12">
                            <el-switch v-model="retrieval_model.score_threshold_enabled" />
                            Score 阈值
                          </el-col>
                        </el-row>
                        <el-row style="width: 100%" :gutter="20">
                          <el-col :span="12">
                            <el-input-number v-model="retrieval_model.top_k" :min="1" :max="10" :step="1" />
                            <el-slider class="slider-style" v-model="retrieval_model.top_k" size="small" :min="1"
                              :max="10" :step="1" />
                          </el-col>
                          <el-col :span="12">
                            <el-input-number v-model="retrieval_model.score_threshold" :disabled="!retrieval_model.score_threshold_enabled
                              " :min="0" :max="1" :step="0.01" />
                            <el-slider class="slider-style" v-model="retrieval_model.score_threshold" size="small"
                              :disabled="!retrieval_model.score_threshold_enabled
                                " :min="0" :max="1" :step="0.01" />
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
                      <el-tabs v-model="retrieval_model.reranking_mode" type="border-card">
                        <el-tab-pane name="weighted_score" label="权重设置">
                          <div>
                            通过调整分配的权重，重新排序策略确定是优先进行语义匹配还是关键字匹配。
                          </div>
                          <el-row style="margin-bottom: 10px">
                            <el-slider v-model="retrieval_model.weights.keyword_setting
                              .keyword_weight
                              " :onchange="(retrieval_model.weights.vector_setting.vector_weight =
                                Number(
                                  (
                                    1 -
                                    retrieval_model.weights.keyword_setting
                                      .keyword_weight
                                  ).toFixed(1)
                                ))
                                " :min="0" :max="1" :step="0.1" />
                            <el-col :span="12">语义{{
                              retrieval_model.weights.keyword_setting
                                .keyword_weight
                            }}</el-col>
                            <el-col :span="12">{{
                              retrieval_model.weights.vector_setting
                                .vector_weight
                            }}关键词</el-col>
                          </el-row>
                          <el-row v-if="retrieval_model.reranking_enable" style="width: 100%; margin-bottom: 10px">
                            <el-input v-model="retrieval_model.reranking_model
                              .reranking_model_name
                              " disabled></el-input>
                          </el-row>
                          <el-row>
                            <el-row style="width: 100%" :gutter="20">
                              <el-col :span="12">Top K</el-col>
                              <el-col :span="12">
                                <el-switch v-model="retrieval_model.score_threshold_enabled
                                  " />
                                Score 阈值
                              </el-col>
                            </el-row>
                            <el-row style="width: 100%" :gutter="20">
                              <el-col :span="12">
                                <el-input-number v-model="retrieval_model.top_k" :min="1" :max="10" :step="1" />
                                <el-slider class="slider-style" v-model="retrieval_model.top_k" size="small" :min="1"
                                  :max="10" :step="1" />
                              </el-col>
                              <el-col :span="12">
                                <el-input-number v-model="retrieval_model.score_threshold" :disabled="!retrieval_model.score_threshold_enabled
                                  " :min="0" :max="1" :step="0.01" />
                                <el-slider class="slider-style" v-model="retrieval_model.score_threshold" size="small"
                                  :disabled="!retrieval_model.score_threshold_enabled
                                    " :min="0" :max="1" :step="0.01" />
                              </el-col>
                            </el-row>
                          </el-row>
                        </el-tab-pane>
                        <el-tab-pane name="reranking_model" label="Rerank 模型">
                          <div>
                            重排序模型将根据候选文档列表与用户问题语义匹配度进行重新排序，从而改进语义排序的结果
                          </div>

                          <el-row style="
                              width: 100%;
                              margin-bottom: 10px;
                              display: flex;
                              align-items: center;
                            ">
                            <el-switch v-model="retrieval_model.reranking_enable" style="margin-right: 10px" />
                            <div>Rerank 模型</div>
                          </el-row>
                          <el-row v-if="retrieval_model.reranking_enable" style="width: 100%; margin-bottom: 10px">
                            <el-select v-model="rerank_model" @change="handleRerankModelChange" disabled>
                              <el-option v-for="item in rerank_model_options" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-row>
                          <el-row>
                            <el-row style="width: 100%" :gutter="20">
                              <el-col :span="12">Top K</el-col>
                              <el-col :span="12">
                                <el-switch v-model="retrieval_model.score_threshold_enabled
                                  " />
                                Score 阈值
                              </el-col>
                            </el-row>
                            <el-row style="width: 100%" :gutter="20">
                              <el-col :span="12">
                                <el-input-number v-model="retrieval_model.top_k" :min="1" :max="10" :step="1" />
                                <el-slider class="slider-style" v-model="retrieval_model.top_k" size="small" :min="1"
                                  :max="10" :step="1" />
                              </el-col>
                              <el-col :span="12">
                                <el-input-number v-model="retrieval_model.score_threshold" :disabled="!retrieval_model.score_threshold_enabled
                                  " :min="0" :max="1" :step="0.01" />
                                <el-slider class="slider-style" v-model="retrieval_model.score_threshold" size="small"
                                  :disabled="!retrieval_model.score_threshold_enabled
                                    " :min="0" :max="1" :step="0.01" />
                              </el-col>
                            </el-row>
                          </el-row>
                        </el-tab-pane>
                      </el-tabs>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-card>
            </el-col>
            <el-col style="margin-bottom: 10px">
              <div class="title">标签设置</div>
              <el-radio-group v-model="official" fill="#6cf">
                <el-radio-button label="官方" value="official" />
                <el-radio-button label="非官方" value="unofficial" />
              </el-radio-group>
            </el-col>
          </div>
          <div style="
              align-self: flex-end;
              display: flex;
              flex-direction: row-reverse;
              justify-content: space-between;
              margin-top: 10px;
            ">
            <el-button style="align-self: flex-end" v-if="step === 1" type="primary" :disabled="fileList.length === 0"
              @click="handleNext">下一步</el-button>
            <el-button v-if="step === 2" type="primary" @click="handleInit">保存并处理</el-button>
            <el-button v-if="step !== 1" type="primary" @click="handlePrev" style="margin-right: 10px">上一步</el-button>
          </div>
        </el-col>
        <!-- diliver -->
        <el-col :span="2"> </el-col>
        <!-- Step 1 右侧：根据是否点击文件列表显示内容 -->
        <el-col :span="11" v-if="step === 1" style="display: flex; flex-direction: column; height: 100%">
          <!-- 未点击文件列表时显示空白 -->
          <div v-if="!showPreview" style="width: 100%; height: 100%"></div>
          <!-- 点击文件列表后显示预览 -->
          <div v-else style="display: flex; flex-direction: column; height: 100%">
            <el-row style="margin-bottom: 10px">
              <div class="title">文件预览</div>
            </el-row>
            <!-- 文件内容预览 -->
            <el-card shadow="never" style="
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
              " body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
              <div v-if="!previewFile" style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                  color: #909399;
                ">
                请选择要预览的文件
              </div>
              <div v-else style="
                  white-space: pre-wrap;
                  word-break: break-word;
                  line-height: 1.6;
                  font-size: 14px;
                ">
                {{ previewContent }}
              </div>
            </el-card>
          </div>
        </el-col>
        <!-- Step 2 右侧：文件预览 -->
        <el-col :span="11" v-if="step === 2" style="display: flex; flex-direction: column; height: 100%">
          <el-row style="
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
            <div class="title">文件预览</div>
          </el-row>
          <el-select v-model="previewFile" placeholder="请选择文件预览" style="width: 100%; margin-bottom: 10px">
            <el-option v-for="value in res" :key="value.id" :label="value.name" :value="value.id" />
          </el-select>
          <!-- 文件内容预览 -->
          <el-card v-if="!isSegmentPreview" shadow="never" style="
              flex: 1;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            " body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
            <div v-if="!previewFile" style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                color: #909399;
              ">
              请点击左侧预览按钮来进行预览
            </div>
            <div v-else style="
                white-space: pre-wrap;
                word-break: break-word;
                line-height: 1.6;
                font-size: 14px;
              ">
              {{ previewContent }}
            </div>
          </el-card>
          <!-- 分段内容预览 -->
          <el-card v-else shadow="never" style="
              flex: 1;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            " body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
            <div style="display: flex; flex-direction: column; gap: 16px">
              <el-card v-for="(segment, index) in segmentPreview" :key="index" shadow="hover">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  ">
                  <span style="font-weight: 600">Chunk {{ index + 1 }}</span>
                  <el-tag size="small" style="border: 'none'">
                    {{ (segment?.content?.length | 0) + (segment?.question?.length | 0) + segment?.answer?.length | 0
                    }} 字符
                  </el-tag>
                </div>

                <div style="
                    white-space: pre-wrap;
                    word-break: break-word;
                    line-height: 1.6;
                    font-size: 14px;
                    color: #606266;
                  ">
                  {{ segment.content }}
                </div>
                <div v-if="segment.question" style="
                    white-space: pre-wrap;
                    word-break: break-word;
                    line-height: 1.6;
                    font-size: 14px;
                    color: #606266;
                  ">
                  问题 {{ segment.question }}
                </div>
                <div v-if="segment.answer" style="
                    white-space: pre-wrap;
                    word-break: break-word;
                    line-height: 1.6;
                    font-size: 14px;
                    color: #606266;
                  ">
                  答案 {{ segment.answer }}
                </div>
              </el-card>
            </div>
          </el-card>
        </el-col>
      </el-card>
    </el-main>
    <el-main v-else-if="step == 3">
      <CreateFinish :dataset="dataset" :files="fileList" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import router from "@/router";
import { ref, watch, onMounted, computed } from "vue";
import { UploadFilled, Back, Document, Delete } from "@element-plus/icons-vue";
import { ElMessage, type UploadProps, type UploadUserFile } from "element-plus";
import {
  initDataset,
  UploadResponse,
  getFilesPreview,
  fetchFileIndexingEstimate,
  getEmbeddingList,
  getRerankList,
  type IndexingEstimateParams,
} from "@/service/datasets";
import CreateFinish from "@/components/createFinish.vue";
import UploadFiles from "@/components/uploadFiles/index.vue";
import { RetrievalModel } from "@/models/dataset";

const radio = ref("datasets");

//文件预览内容
const fileList = ref<UploadUserFile[]>([]);
const previewFile = ref<string | null>(null);
const previewContent = ref<string>("");
const showPreview = ref(false); // 控制是否显示文件预览模块
const segmentPreview = ref<any[]>([]); // 存储分段预览数据
const isSegmentPreview = ref(false); // 标识当前是否为分段预览模式

const res = ref<UploadResponse[]>([]);
const step = ref(1);

// 监听 radio 变化，重置上传序号和清空文件列表
watch(
  () => radio.value,
  () => {
    // 切换上传类型时清空已上传的文件
    res.value = [];
    fileList.value = [];
    previewFile.value = null;
    previewContent.value = "";
    showPreview.value = false;
  }
);
// accept
const accept = computed(() => {
  return radio.value === 'datasets' ? '.pdf,.doc,.docx,.txt,.html,.markdown,.md,.xls,.xlsx,.csv' : '.csv,.xls,.xlsx'
});

const process_rule = ref("custom");

const custom = ref({
  pre_processing_rules: [
    {
      id: "remove_extra_spaces",
      enabled: false,
    },
    {
      id: "remove_urls_emails",
      enabled: false,
    },
  ],
  segmentation: {
    separator: "\\n\\n",
    max_tokens: 500,
    chunk_overlap: 50,
  },
});

const hierarchical = ref({
  parent_mode: "paragraph",
  pre_processing_rules: [
    {
      id: "remove_extra_spaces",
      enabled: false,
    },
    {
      id: "remove_urls_and_emails",
      enabled: false,
    },
  ],
  segmentation: {
    separator: "\\n\\n",
    max_tokens: 500,
  },
  subchunk_segmentation: {
    separator: "\\n\\n",
    max_tokens: 500,
  },
});

const indexing_technique = ref("high_quality");
const embedding_model = ref("");
const embedding_model_provider = ref("");
const embedding_model_options = ref<any[]>([]);

const retrieval_model = ref<RetrievalModel>({
  search_method: "semantic_search",
  top_k: 5,
  reranking_enable: true,
  reranking_model: {
    reranking_model_name: "gte-rerank-v2",
    reranking_provider_name: "langgenius/tongyi/tongyi",
  },
  score_threshold: 0.5,
  score_threshold_enabled: false,
  reranking_mode: "weighted_score",
  weights: {
    keyword_setting: {
      keyword_weight: 0.3,
    },
    vector_setting: {
      embedding_model_name: "",
      embedding_provider_name: "",
      vector_weight: 0.7,
    },
    weight_type: "customized",
  },
});

// Embedding 模型选择
const getEmbeddingModel = async () => {
  try {
    const res = await getEmbeddingList();

    embedding_model_options.value = [];

    res.data.forEach((providerItem) => {
      providerItem.models.forEach((model) => {
        embedding_model_options.value.push({
          value: model.model,
          label: model.label.zh_Hans, //中文标签
          provider: providerItem.provider,
        });
      });
    });
    if (embedding_model_options.value.length > 0) {
      embedding_model.value = embedding_model_options.value[0].value;
      embedding_model_provider.value =
        embedding_model_options.value[0].provider;
    }
  } catch (error) {
    ElMessage.error("获取Embedding模型选项失败");
  }
};
const handleEmbeddingModelChange = (value: string) => {
  const selectedModel = embedding_model_options.value.find(
    (item) => item.value === value
  );
  if (selectedModel) {
    embedding_model_provider.value = selectedModel.provider;
  }
};

// rerank 模型选择

const rerank_model = ref("");
const rerank_model_provider = ref("");
const rerank_model_options = ref<any>([]);
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
const handleRerankModelChange = (value: string) => {
  const selectedModel = rerank_model_options.value.find(
    (item) => item.value === value
  );
  if (selectedModel) {
    rerank_model_provider.value = selectedModel.provider;
    // 同步更新到 retrieval_model
    retrieval_model.value.reranking_model.reranking_model_name = value;
    retrieval_model.value.reranking_model.reranking_provider_name =
      selectedModel.provider;
  }
};

// official
// unofficial
const official = ref("official");

const dataset = ref({});


const handlePrev = () => {
  step.value -= 1;
  // 从 step 2 返回到 step 1 时，重置预览状态
  if (step.value === 1) {
    showPreview.value = false;
  }
};
const handleNext = () => {
  step.value += 1;

  if (radio.value === "qa_pairs") {
    process_rule.value = ''
  } else {
    process_rule.value = 'custom'
  }

  // 从 step 1 进入 step 2 时，清空文件预览内容
  if (step.value === 2) {
    previewContent.value = "";
    previewFile.value = null;
    showPreview.value = false;
  }
};

const handleCollapseProcessRule = (value: string) => {
  if (radio.value === "qa_pairs") {
    return false;
  }
  return value !== process_rule.value;
};

const handleCollapseParentMode = (value: string) => {
  return value !== hierarchical.value.parent_mode;
};

const handleCollapseSearchMethod = (value: string) => {
  return value !== retrieval_model.value.search_method;
};

const handleInit = () => {
  // console.log('res', res.value)
  // console.log('res', res.value.map(x => x.id))
  const params = {
    data_source: {
      type: "upload_file",
      info_list: {
        data_source_type: "upload_file",
        file_info_list: {
          file_ids: res.value.map((x) => x.id),
        },
      },
    },
    doc_form: radio.value === "datasets" ? "text_model" : "qa_model",
    doc_language: "Chinese Simplified",
    embedding_model: embedding_model.value,
    embedding_model_provider: embedding_model_provider.value,
    indexing_technique: indexing_technique.value,
    process_rule: {
      mode: process_rule.value === '' ? "custom" : process_rule.value,
      rules:
        process_rule.value === "custom" ? custom.value : hierarchical.value,
    },
    retrieval_model: retrieval_model.value,
    official: official.value,
  };

  initDataset(params).then((res) => {
    dataset.value = res;
    step.value = 3;
  });
};

// 获取文件预览内容
const fetchFilePreview = async (fileId: string) => {
  if (!fileId) {
    previewContent.value = "";
    return;
  }
  try {
    const response = await getFilesPreview(fileId);
    previewContent.value = response.content || "暂无预览内容";
  } catch (error) {
    console.error("获取文件预览失败:", error);
    ElMessage.error("获取文件预览失败");
    previewContent.value = "加载失败，请重试";
  }
};

//点击预览按钮
const handlePreviewButton = () => {
  // 增加参数校验
  if (
    custom.value?.segmentation?.max_tokens &&
    custom.value.segmentation.max_tokens <
    custom.value.segmentation.chunk_overlap
  ) {
    ElMessage.warning("分段最大长度应大于分段重叠长度");
    return;
  }

  if (res.value.length > 0) {
    // 根据当前选择的 process_rule 模式获取对应的配置
    const currentRules = custom.value;

    const params: IndexingEstimateParams = {
      doc_form: radio.value === "datasets" ? "text_model" : "qa_model",
      doc_language: "Chinese Simplified",
      indexing_technique: indexing_technique.value,
      info_list: {
        data_source_type: "upload_file",
        file_info_list: {
          file_ids: res.value.map((x) => x.id),
        },
      },
      process_rule: {
        mode: process_rule.value === '' ? "custom" : process_rule.value,
        rules: currentRules,
      },
    };

    fetchFileIndexingEstimate(params)
      .then((response) => {
        console.log("分段预览结果:", response);
        // 处理返回的分段内容,且不为空的
        if (response && response.preview) {
          if (radio.value === "datasets") {
            segmentPreview.value = response.preview;
          } else {
            segmentPreview.value = response.qa_preview;
          }
          isSegmentPreview.value = true;
          ElMessage.success("分段预览加载成功");
        } else {
          ElMessage.warning("暂无分段预览数据");
        }
      })
      .catch((error) => {
        console.error("获取分段预览失败:", error);
        ElMessage.error("获取分段预览失败");
      });
  } else {
    ElMessage.warning("请先上传文件");
  }
};

// 点击文件名显示预览
const handleFileClick = (fileId: string) => {
  if (step.value === 1) {
    showPreview.value = true; // 显示预览模块
    previewFile.value = fileId; // 选中该文件
  }
};

// watch侦听文件选择变化，自动获取预览内容
watch(previewFile, (newFileId) => {
  if (newFileId) {
    // 在 step 1 时，只获取文件原始内容
    if (step.value === 1) {
      fetchFilePreview(newFileId)
        .then((response) => {
          //previewContent.value = response.content
        })
        .catch((error) => {
          console.error("获取文件预览失败:", error);
          previewContent.value = "加载失败，请重试";
        });
    }
    // 在 step 2 时，获取分段预览
    else if (step.value === 2) {
      // 增加参数校验
      if (
        custom?.segmentation?.max_tokens &&
        custom.segmentation.max_tokens < custom.segmentation.chunk_overlap
      ) {
        ElMessage.warning("分段最大长度应大于分段重叠长度");
        return;
      }

      const params: IndexingEstimateParams = {
        doc_form: radio.value === 'datasets' ? "text_model" : "qa_model",
        doc_language: "Chinese Simplified",
        indexing_technique: indexing_technique.value,
        info_list: {
          data_source_type: "upload_file",
          file_info_list: {
            file_ids: [newFileId],
          },
        },
        process_rule: {
          mode: process_rule.value === '' ? "custom" : process_rule.value,
          rules: custom.value,
        },
      };

      fetchFileIndexingEstimate(params)
        .then((response) => {
          // 处理返回的分段内容
          if (response && response.preview) {
            if (radio.value === "datasets") {
              segmentPreview.value = response.preview;
            } else {
              segmentPreview.value = response.qa_preview;
            }
            isSegmentPreview.value = true;
          } else {
            segmentPreview.value = [];
            isSegmentPreview.value = false;
          }
        })
        .catch((error) => {
          console.error("获取分段预览失败:", error);
          segmentPreview.value = [];
          isSegmentPreview.value = false;
        });
    }
  } else {
    previewContent.value = "";
    segmentPreview.value = [];
    isSegmentPreview.value = false;
  }
});

onMounted(() => {
  getEmbeddingModel();
  getRerankModel();
});
</script>

<style scoped lang="scss">
.header-style {
  display: flex;
  background-color: #f5f5f5;
  align-items: center;
  height: auto;
  // border-bottom: 1px solid var(--el-border-color);
}

.content-container {
  height: 100%;
  width: 100%;
}

.context-style {
  height: 100%;
  width: 100%;
}

.wapper-style {
  height: 100%;
}

.title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}

.collapse-item-title {
  font-size: 14px;
  height: 20px;
  display: flex;
  flex-direction: row;
}

.slider-style {
  >.el-slider__runway {
    margin-right: 10px;
  }

  >.el-input-number {
    width: 60px !important;
  }
}

.font-weight {
  font-weight: 600;
}

// 文件列表容器样式
.file-list-container {
  margin-top: 20px;
  width: 100%;
}

.file-list-card {
  max-height: 400px;
  overflow: hidden;
}

.file-list-scroll {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;

  // 美化滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e6e8eb;
  }

  .file-info {
    display: flex;
    align-items: center;
    flex: 1;
    cursor: pointer;

    .file-icon {
      margin-right: 12px;
      flex-shrink: 0;
    }

    .file-details {
      flex: 1;
      min-width: 0;

      .file-name {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-meta {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .delete-icon {
    cursor: pointer;
    flex-shrink: 0;
    margin-left: 12px;
    transition: color 0.3s ease;

    &:hover {
      color: #f56c6c !important;
    }
  }
}

// 旋转动画
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.segment-item {
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;

  &:hover {
    border-color: #409eff;
  }

  :deep(.el-card__header) {
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
  }

  :deep(.el-card__body) {
    padding: 16px;
  }
}
</style>
