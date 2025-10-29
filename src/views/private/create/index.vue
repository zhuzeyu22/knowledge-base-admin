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
        <el-main class="context-style" style="overflow: auto">
            <el-card class="wapper-style" body-style="height: 100%; display: flex; flex-direction: row;">
                <el-col :span="11" style="display: flex; flex-direction: column;">
                    <div v-if="step === 1" style="flex-grow: 1">
                        <el-row>
                            <el-radio-group v-model="radio" text-color="#626aef" fill="rgb(239, 240, 253)"
                                style="margin-bottom: 10px;">
                                <el-radio-button label="文档上传" value="datasets" />
                                <el-radio-button label="问答对上传" value="qa_pairs" disabled />
                            </el-radio-group>
                            <div style="padding: 10px; font-size: 14px;">
                                支持上传多个文件, 支持扩展名:doc,.docx,.txt,.pdf,.html,.markdown,.xls,.xlsx,.csv
                                最大上传文件数量为10个，每个文件不超过40MB
                            </div>
                            <el-upload v-model:file-list="fileList" style="width: 100%;" drag :auto-upload="false"
                                accept=".doc,.docx,.txt,.pdf,.html,.markdown,.md,.xls,.xlsx,.csv" action="" :limit="10"
                                :on-change="handleUploadChange" multiple>
                                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                <div class="el-upload__text">
                                    <el-col>
                                        <el-button type="primary" size="small">选择文件上传</el-button>
                                    </el-col>
                                    <el-col style="margin-top: 10px;"> 或将文件拖拽到此处</el-col>
                                </div>
                            </el-upload>
                        </el-row>
                    </div>
                    <div v-else-if="step === 2" style="flex-grow: 1;overflow-y: auto;">
                        <el-col style="margin-bottom: 10px;">
                            <div class="title">
                                分段设置
                            </div>
                            <el-card shadow="never">
                                <el-collapse v-model="process_rule" accordion
                                    :before-collapse="handleCollapseProcessRule">
                                    <el-collapse-item title="通用" name="custom">
                                        <el-row :gutter="20">
                                            <el-col :span="8">分段标识符</el-col>
                                            <el-col :span="8">分段最大长度</el-col>
                                            <el-col :span="8">分段重叠长度</el-col>
                                        </el-row>
                                        <el-row :gutter="20">
                                            <el-col :span="8"><el-input
                                                    v-model="custom.segmentation.separator"></el-input></el-col>
                                            <el-col :span="8"><el-input-number
                                                    v-model="custom.segmentation.max_tokens"></el-input-number></el-col>
                                            <el-col :span="8"><el-input-number
                                                    v-model="custom.segmentation.chunk_overlap"></el-input-number></el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="24">
                                                文本预处理规则
                                            </el-col>
                                            <el-col :span="24">
                                                <el-checkbox v-model="custom.pre_processing_rules[0].enabled"
                                                    label="替换掉连续的空格、换行符和制表符" />
                                            </el-col>
                                            <el-col :span="24">
                                                <el-checkbox v-model="custom.pre_processing_rules[1].enabled"
                                                    label="删除所有 URL 和电子邮件地址" />
                                            </el-col>
                                        </el-row>
                                    </el-collapse-item>
                                    <el-collapse-item title="父子分段" name="hierarchical">
                                        <el-row style="width: 100%; margin-bottom: 10px;">
                                            父块用作上下文
                                        </el-row>
                                        <el-row style="width: 100%; margin-bottom: 10px;">
                                            <el-card shadow="never">
                                                <el-collapse v-model="hierarchical.parent_mode" style="width: 100%;"
                                                    accordion :before-collapse="handleCollapseParentMode">
                                                    <el-collapse-item title="段落" name="paragraph">
                                                        <el-card shadow="never">
                                                            <div style="font-size: 12px; margin-bottom: 8px;">
                                                                此模式根据分隔符和最大块长度将文本拆分为段落，使用拆分文本作为检索的父块</div>
                                                            <el-row :gutter="20">
                                                                <el-col :span="10">分段标识符</el-col>
                                                                <el-col :span="10">分段最大长度</el-col>
                                                            </el-row>
                                                            <el-row :gutter="20">
                                                                <el-col :span="10"><el-input
                                                                        v-model="hierarchical.segmentation.separator"></el-input></el-col>
                                                                <el-col :span="10"><el-input-number
                                                                        v-model="hierarchical.segmentation.max_tokens"></el-input-number></el-col>
                                                            </el-row>
                                                        </el-card>

                                                    </el-collapse-item>
                                                    <el-collapse-item title="全文" name="full-doc">
                                                        <div style="font-size: 12px;">
                                                            整个文档用作父块并直接检索。请注意，出于性能原因，超过10000个标记的文本将被自动截断。
                                                        </div>
                                                    </el-collapse-item>
                                                </el-collapse>
                                            </el-card>
                                        </el-row>
                                        <el-row style="width: 100%; margin-bottom: 10px;">
                                            子块用于检索
                                        </el-row>
                                        <el-row style="width: 100%; margin-bottom: 10px;">
                                            <el-row :gutter="20" style="width: 100%;">
                                                <el-col :span="10">分段标识符</el-col>
                                                <el-col :span="10">分段最大长度</el-col>
                                            </el-row>
                                            <el-row :gutter="20" style="width: 100%;">
                                                <el-col :span="10"><el-input
                                                        v-model="hierarchical.subchunk_segmentation.separator"></el-input></el-col>
                                                <el-col :span="10"><el-input-number
                                                        v-model="hierarchical.subchunk_segmentation.max_tokens"></el-input-number></el-col>
                                            </el-row>
                                        </el-row>
                                        <el-row style="width: 100%; margin-bottom: 10px;">
                                            <el-col :span="24">
                                                文本预处理规则
                                            </el-col>
                                            <el-col :span="24">
                                                <el-checkbox v-model="hierarchical.pre_processing_rules[0].enabled"
                                                    label="替换掉连续的空格、换行符和制表符" />
                                            </el-col>
                                            <el-col :span="24">
                                                <el-checkbox v-model="hierarchical.pre_processing_rules[1].enabled"
                                                    label="删除所有 URL 和电子邮件地址" />
                                            </el-col>
                                        </el-row>
                                    </el-collapse-item>
                                </el-collapse>
                            </el-card>
                        </el-col>
                        <!-- <el-col>
                            <div class="title">
                                索引方式
                            </div>
                            <el-collapse v-model="indexing_technique" accordion
                                :before-collapse="handleCollapseIndexingTechnique">
                                <el-collapse-item title="高质量" name="high_quality">
                                </el-collapse-item>
                            </el-collapse>
                        </el-col> -->
                        <el-col style="margin-bottom: 10px;">
                            <div class="title">
                                Embedding 模型
                            </div>
                            <el-input v-model="embedding_model" disabled></el-input>
                        </el-col>
                        <el-col style="margin-bottom: 10px;">
                            <div class="title">
                                检索设置
                            </div>
                            <el-card shadow="never">
                                <el-collapse v-model="retrieval_model.search_method" accordion
                                    :before-collapse="handleCollapseSearchMethod">
                                    <el-collapse-item title="向量检索" name="semantic_search">
                                        <el-row style="width: 100%; margin-bottom: 10px;">
                                            通过生成查询嵌入并查询与其向量表示最相似的文本分段
                                        </el-row>
                                        <el-card shadow="never">
                                            <el-row
                                                style="width: 100%; margin-bottom: 10px; display: flex; align-items: center;">
                                                <el-switch v-model="retrieval_model.reranking_enable"
                                                    style="margin-right: 10px;" />
                                                <div>Rerank 模型</div>
                                            </el-row>
                                            <el-row v-if="retrieval_model.reranking_enable"
                                                style="width: 100%; margin-bottom: 10px;">
                                                <el-input v-model="retrieval_model.reranking_model_name"
                                                    disabled></el-input>
                                            </el-row>
                                            <el-row>
                                                <el-row style="width: 100%;" :gutter="20">
                                                    <el-col :span="12">Top K</el-col>
                                                    <el-col :span="12">
                                                        <el-switch v-model="retrieval_model.score_threshold_enabled" />
                                                        Score 阈值
                                                    </el-col>
                                                </el-row>
                                                <el-row style="width: 100%;" :gutter="20">
                                                    <el-col :span="12">
                                                        <el-input-number v-model="retrieval_model.top_k" :min="1"
                                                            :max="10" :step="1" />
                                                        <el-slider class="slider-style" v-model="retrieval_model.top_k"
                                                            size="small" :min="1" :max="10" :step="1" />
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-input-number v-model="retrieval_model.score_threshold"
                                                            :disabled="!retrieval_model.score_threshold_enabled"
                                                            :min="0" :max="1" :step="0.01" />
                                                        <el-slider class="slider-style"
                                                            v-model="retrieval_model.score_threshold" size="small"
                                                            :disabled="!retrieval_model.score_threshold_enabled"
                                                            :min="0" :max="1" :step="0.01" />
                                                    </el-col>
                                                </el-row>
                                            </el-row>
                                        </el-card>
                                    </el-collapse-item> <el-collapse-item title="全文检索" name="full_text_search">
                                        <el-row style="width: 100%; margin-bottom: 10px;">
                                            索引文档中的所有词汇，从而允许用户查询任意词汇，并返回包含这些词汇的文本片段
                                        </el-row>
                                        <el-card shadow="never">
                                            <el-row
                                                style="width: 100%; margin-bottom: 10px; display: flex; align-items: center;">
                                                <el-switch v-model="retrieval_model.reranking_enable"
                                                    style="margin-right: 10px;" />
                                                <div>Rerank 模型</div>
                                            </el-row>
                                            <el-row v-if="retrieval_model.reranking_enable"
                                                style="width: 100%; margin-bottom: 10px;">
                                                <el-input v-model="retrieval_model.reranking_model_name"
                                                    disabled></el-input>
                                            </el-row>
                                            <el-row>
                                                <el-row style="width: 100%;" :gutter="20">
                                                    <el-col :span="12">Top K</el-col>
                                                    <el-col :span="12">
                                                        <el-switch v-model="retrieval_model.score_threshold_enabled" />
                                                        Score 阈值
                                                    </el-col>
                                                </el-row>
                                                <el-row style="width: 100%;" :gutter="20">
                                                    <el-col :span="12">
                                                        <el-input-number v-model="retrieval_model.top_k" :min="1"
                                                            :max="10" :step="1" />
                                                        <el-slider class="slider-style" v-model="retrieval_model.top_k"
                                                            size="small" :min="1" :max="10" :step="1" />
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-input-number v-model="retrieval_model.score_threshold"
                                                            :disabled="!retrieval_model.score_threshold_enabled"
                                                            :min="0" :max="1" :step="0.01" />
                                                        <el-slider class="slider-style"
                                                            v-model="retrieval_model.score_threshold" size="small"
                                                            :disabled="!retrieval_model.score_threshold_enabled"
                                                            :min="0" :max="1" :step="0.01" />
                                                    </el-col>
                                                </el-row>
                                            </el-row>
                                        </el-card>
                                    </el-collapse-item> <el-collapse-item title="混合检索" name="hybrid_search">
                                        <el-row style="width: 100%; margin-bottom: 10px;">
                                            同时执行全文检索和向量检索，并应用重排序步骤，从两类查询结果中选择匹配用户问题的最佳结果，用户可以选择设置权重或配置重新排序模型。
                                        </el-row>
                                        <el-row>

                                            <el-tabs v-model="retrieval_model.reranking_mode" type="border-card">
                                                <el-tab-pane name="weighted_score" label="权重设置">
                                                    <div>通过调整分配的权重，重新排序策略确定是优先进行语义匹配还是关键字匹配。</div>
                                                    <el-row style="margin-bottom: 10px;">
                                                        <el-slider
                                                            v-model="retrieval_model.weights.keyword_setting.keyword_weight"
                                                            :onchange="retrieval_model.weights.vector_setting.vector_weight = Number((1 - retrieval_model.weights.keyword_setting.keyword_weight).toFixed(1))"
                                                            :min="0" :max="1" :step="0.1" />
                                                        <el-col :span="12">语义{{
                                                            retrieval_model.weights.keyword_setting.keyword_weight
                                                            }}</el-col>
                                                        <el-col :span="12">{{
                                                            retrieval_model.weights.vector_setting.vector_weight
                                                        }}关键词</el-col>
                                                    </el-row>
                                                    <el-row v-if="retrieval_model.reranking_enable"
                                                        style="width: 100%; margin-bottom: 10px;">
                                                        <el-input v-model="retrieval_model.reranking_model_name"
                                                            disabled></el-input>
                                                    </el-row>
                                                    <el-row>
                                                        <el-row style="width: 100%;" :gutter="20">
                                                            <el-col :span="12">Top K</el-col>
                                                            <el-col :span="12">
                                                                <el-switch
                                                                    v-model="retrieval_model.score_threshold_enabled" />
                                                                Score 阈值
                                                            </el-col>
                                                        </el-row>
                                                        <el-row style="width: 100%;" :gutter="20">
                                                            <el-col :span="12">
                                                                <el-input-number v-model="retrieval_model.top_k"
                                                                    :min="1" :max="10" :step="1" />
                                                                <el-slider class="slider-style"
                                                                    v-model="retrieval_model.top_k" size="small"
                                                                    :min="1" :max="10" :step="1" />
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-input-number
                                                                    v-model="retrieval_model.score_threshold"
                                                                    :disabled="!retrieval_model.score_threshold_enabled"
                                                                    :min="0" :max="1" :step="0.01" />
                                                                <el-slider class="slider-style"
                                                                    v-model="retrieval_model.score_threshold"
                                                                    size="small"
                                                                    :disabled="!retrieval_model.score_threshold_enabled"
                                                                    :min="0" :max="1" :step="0.01" />
                                                            </el-col>
                                                        </el-row>
                                                    </el-row>
                                                </el-tab-pane>
                                                <el-tab-pane name="reranking_model" label="Rerank 模型">
                                                    <div>重排序模型将根据候选文档列表与用户问题语义匹配度进行重新排序，从而改进语义排序的结果</div>

                                                    <el-row
                                                        style="width: 100%; margin-bottom: 10px; display: flex; align-items: center;">
                                                        <el-switch v-model="retrieval_model.reranking_enable"
                                                            style="margin-right: 10px;" />
                                                        <div>Rerank 模型</div>
                                                    </el-row>
                                                    <el-row v-if="retrieval_model.reranking_enable"
                                                        style="width: 100%; margin-bottom: 10px;">
                                                        <el-input v-model="retrieval_model.reranking_model_name"
                                                            disabled></el-input>
                                                    </el-row>
                                                    <el-row>
                                                        <el-row style="width: 100%;" :gutter="20">
                                                            <el-col :span="12">Top K</el-col>
                                                            <el-col :span="12">
                                                                <el-switch
                                                                    v-model="retrieval_model.score_threshold_enabled" />
                                                                Score 阈值
                                                            </el-col>
                                                        </el-row>
                                                        <el-row style="width: 100%;" :gutter="20">
                                                            <el-col :span="12">
                                                                <el-input-number v-model="retrieval_model.top_k"
                                                                    :min="1" :max="10" :step="1" />
                                                                <el-slider class="slider-style"
                                                                    v-model="retrieval_model.top_k" size="small"
                                                                    :min="1" :max="10" :step="1" />
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-input-number
                                                                    v-model="retrieval_model.score_threshold"
                                                                    :disabled="!retrieval_model.score_threshold_enabled"
                                                                    :min="0" :max="1" :step="0.01" />
                                                                <el-slider class="slider-style"
                                                                    v-model="retrieval_model.score_threshold"
                                                                    size="small"
                                                                    :disabled="!retrieval_model.score_threshold_enabled"
                                                                    :min="0" :max="1" :step="0.01" />
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
                    </div>
                    <div style=" align-self: flex-end; display: flex; flex-direction: row-reverse; justify-content:
                                                        space-between; margin-top: 10px;">
                        <el-button style="align-self: flex-end;" v-if="step === 1" type="primary"
                            @click="handleNext">下一步</el-button>
                        <el-button v-if="step === 2" type="primary" @click="handleInit">保存并处理</el-button>
                        <el-button v-if="step !== 1" type="primary" @click="handlePrev"
                            style="margin-right: 10px;">上一步</el-button>
                    </div>
                </el-col>
                <!-- diliver -->
                <el-col :span="2">
                </el-col>
                <el-col :span="11" v-if="step === 2">
                    <el-row>
                        文件预览
                    </el-row>
                    <el-select v-model="previewFile" placeholder="请选择文件预览类型" style="width: 100%; margin-top: 10px;">
                        <el-option v-for="value in fileList" :key="value.uid" :label="value.name" :value="value.uid" />
                    </el-select>
                </el-col>
            </el-card>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">

import router from '@/router';
import { ref } from 'vue'
import { UploadFilled, Back } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { initDataset, uploadDocument, UploadResponse } from '@/service/datasets';

const radio = ref('datasets')
const fileList = ref<UploadUserFile[]>([])
const previewFile = ref<string | null>(null)

const res = ref<UploadResponse[]>([])
const step = ref(1)

const process_rule = ref('custom')
const custom = ref({
    segmentation: {
        separator: '\\n\\n',
        max_tokens: 500,
        chunk_overlap: 50,
    },
    pre_processing_rules: [
        {
            id: "remove_extra_spaces",
            enabled: false
        }, {
            id: 'remove_urls_and_emails',
            enabled: false
        }
    ],
})
const hierarchical = ref({
    parent_mode: 'paragraph',
    pre_processing_rules: [
        {
            id: "remove_extra_spaces",
            enabled: false
        }, {
            id: 'remove_urls_and_emails',
            enabled: false
        }
    ],
    segmentation: {
        separator: '\\n\\n',
        max_tokens: 500,
    },
    subchunk_segmentation: {
        separator: '\\n\\n',
        max_tokens: 500,
    },
})

const indexing_technique = ref('high_quality')
const embedding_model = ref('text-embedding-v1')
const embedding_model_provider = ref('langgenius/tongyi/tongyi')

const retrieval_model = ref({
    search_method: 'semantic_search',
    top_k: 5,
    reranking_enable: true,
    reranking_model_name: 'gte-rerank-v2',
    score_threshold: 0.5,
    score_threshold_enabled: false,
    reranking_mode: 'weighted_score',
    weights: {
        keyword_setting: {
            keyword_weight: 0.3
        },
        vector_setting: {
            embedding_model_name: "",
            embedding_provider_name: "",
            vector_weight: 0.7
        },
        weight_type: 'customized'
    }
})

// official
// unofficial
const official = ref('official')

const handleUploadChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    const formData = new FormData()
    if (uploadFile.raw) {
        formData.append('file', uploadFile.raw)
        uploadDocument(formData).then(response => {
            res.value.push(response)
            console.log('File uploaded successfully:', response)
        }).catch(error => {
            console.error('File upload failed:', error)
        })
    }
}

const handlePrev = () => {
    step.value -= 1
}
const handleNext = () => {
    step.value += 1
}

const handleCollapseProcessRule = (value: string) => {
    return value !== process_rule.value
}

const handleCollapseParentMode = (value: string) => {
    console.log(value)
    console.log('parent_mode', hierarchical.value.parent_mode)
    return value !== hierarchical.value.parent_mode
}

const handleCollapseSearchMethod = (value: string) => {
    return value !== retrieval_model.value.search_method
}

const handleInit = () => {
    // console.log('res', res.value)
    // console.log('res', res.value.map(x => x.id))
    const params = {
        data_source: {
            type: "upload_file",
            info_list: {
                data_source_type: "upload_file",
                file_info_list: {
                    file_ids: res.value.map(x => x.id)
                }
            }
        },
        doc_form: 'text_model',
        doc_language: 'Chinese Simplified',
        embedding_model: embedding_model.value,
        embedding_model_provider: embedding_model_provider.value,
        indexing_technique: indexing_technique.value,
        process_rule: {
            mode: process_rule.value,
            rules: process_rule.value === 'custom' ? custom.value : hierarchical.value
        },
        retrieval_model: retrieval_model.value,
        official: official.value
    }

    initDataset(params).then(res => {
        console.log('res', res)
    })
}


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
</style>