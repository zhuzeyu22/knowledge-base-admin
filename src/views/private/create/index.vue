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
                <el-col :span="11" style="display: flex; flex-direction: column;">
                    <div v-if="step === 1" style="flex-grow: 1">
                        <el-row>
                            <el-radio-group v-model="radio" text-color="#626aef" fill="rgb(239, 240, 253)"
                                style="margin-bottom: 10px;">
                                <el-radio-button label="文档上传" value="datasets" />
                                <el-radio-button label="问答对上传" value="qa_pairs" />
                            </el-radio-group>
                            <div style="padding: 10px; font-size: 14px;">
                                {{ `支持上传多个文件,
                                支持扩展名:${radio === 'datasets'
                                        ? 'doc,.docx,.txt,.pdf,.html,.markdown,.xls,.xlsx,' : ''}.csv最大上传文件数量为10个，每个文件不超过40MB`
                                }}
                            </div>
                            <el-upload v-model:file-list="fileList" style="width: 100%;" drag :auto-upload="false"
                                :accept="radio === 'datasets' ? '.doc,.docx,.txt,.pdf,.html,.markdown,.md,.xls,.xlsx,.csv' : '.csv'"
                                action="" :limit="10" :on-change="handleUploadChange" multiple :show-file-list="false">
                                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                <div class="el-upload__text">
                                    <el-col>
                                        <el-button type="primary" size="small">选择文件上传</el-button>
                                    </el-col>
                                    <el-col style="margin-top: 10px;"> 或将文件拖拽到此处</el-col>
                                </div>
                            </el-upload>
                            <!-- 已上传文件列表 -->
                            <div v-if="res.length > 0" style="margin-top: 20px; width: 100%;">
                                <div v-for="file in res" :key="file.id" class="uploaded-file-item">
                                    <div class="file-info" @click="handleFileClick(file.id)">
                                        <el-icon class="file-icon" :size="32" color="#409EFF">
                                            <Document />
                                        </el-icon>
                                        <div class="file-details">
                                            <div class="file-name">{{ file.name }}</div>
                                            <div class="file-meta">{{ getFileExtension(file.name) }} · {{
                                                formatFileSize(file.size) }}</div>
                                        </div>
                                    </div>
                                    <el-icon class="delete-icon" @click="handleDeleteFile(file.id)" :size="20"
                                        color="#909399">
                                        <Delete />
                                    </el-icon>
                                </div>
                            </div>
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
                                        <el-row>
                                            <el-col :span="4">
                                                <el-button style="color: skyblue;"
                                                    @click="handlePreviewButton">预览</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button style="border: none;color:black">重置</el-button>
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
                                                <el-input v-model="retrieval_model.reranking_model.reranking_model_name"
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
                                                <el-input v-model="retrieval_model.reranking_model.reranking_model_name"
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
                                                        <el-input
                                                            v-model="retrieval_model.reranking_model.reranking_model_name"
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
                            :disabled="fileList.length === 0" @click="handleNext">下一步</el-button>
                        <el-button v-if="step === 2" type="primary" @click="handleInit">保存并处理</el-button>
                        <el-button v-if="step !== 1" type="primary" @click="handlePrev"
                            style="margin-right: 10px;">上一步</el-button>
                    </div>
                </el-col>
                <!-- diliver -->
                <el-col :span="2">
                </el-col>
                <!-- Step 1 右侧：根据是否点击文件列表显示内容 -->
                <el-col :span="11" v-if="step === 1" style="display: flex; flex-direction: column; height: 100%;">
                    <!-- 未点击文件列表时显示空白 -->
                    <div v-if="!showPreview" style="width: 100%; height: 100%;"></div>
                    <!-- 点击文件列表后显示预览 -->
                    <div v-else style="display: flex; flex-direction: column; height: 100%;">
                        <el-row style="margin-bottom: 10px;">
                            <div class="title">文件预览</div>
                        </el-row>
                        <!-- 文件内容预览 -->
                        <el-card shadow="never"
                            style="flex: 1; overflow: hidden; display: flex; flex-direction: column;"
                            body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
                            <div v-if="!previewFile"
                                style="display: flex; justify-content: center; align-items: center; height: 100%; color: #909399;">
                                请选择要预览的文件
                            </div>
                            <div v-else
                                style="white-space: pre-wrap; word-break: break-word; line-height: 1.6; font-size: 14px;">
                                {{ previewContent }}
                            </div>
                        </el-card>
                    </div>
                </el-col>
                <!-- Step 2 右侧：文件预览 -->
                <el-col :span="11" v-if="step === 2" style="display: flex; flex-direction: column; height: 100%;">
                    <el-row
                        style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div class="title">文件预览</div>
                    </el-row>
                    <el-select v-model="previewFile" placeholder="请选择文件预览" style="width: 100%; margin-bottom: 10px;" >
                        <el-option v-for="value in res" :key="value.id" :label="value.name" :value="value.id" />
                    </el-select>
                    <!-- 文件内容预览 -->
                    <el-card v-if="!isSegmentPreview" shadow="never"
                        style="flex: 1; overflow: hidden; display: flex; flex-direction: column;"
                        body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
                        <div v-if="!previewFile" style="display: flex; justify-content: center; align-items: center; height: 100%; color: #909399;">
                            请点击左侧预览按钮来进行预览
                        </div>
                        <div v-else
                            style="white-space: pre-wrap; word-break: break-word; line-height: 1.6; font-size: 14px;">
                            {{ previewContent }}
                        </div>
                    </el-card>
                    <!-- 分段内容预览 -->
                    <el-card v-else shadow="never"
                        style="flex: 1; overflow: hidden; display: flex; flex-direction: column;"
                        body-style="flex: 1; overflow: auto; display: flex; flex-direction: column;">
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <el-card v-for="(segment, index) in segmentPreview" :key="index" shadow="hover">

                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-weight: 600;">Chunk {{ index + 1 }}</span>
                                    <el-tag size="small" style="border:'none' ;">{{ segment.content?.length || 0 }}
                                        字符</el-tag>
                                </div>

                                <div
                                    style="white-space: pre-wrap; word-break: break-word; line-height: 1.6; font-size: 14px; color: #606266;">
                                    {{ segment.content }}
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

import router from '@/router';
import { ref, watch } from 'vue'
import { UploadFilled, Back, Document, Delete } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import { initDataset, RetrievalModel, uploadDocument, UploadResponse, getFilesPreview, fetchFileIndexingEstimate, type IndexingEstimateParams } from '@/service/datasets';
import CreateFinish from '@/components/createFinish.vue'

const radio = ref('datasets')

//文件预览内容
const fileList = ref<UploadUserFile[]>([])
const previewFile = ref<string | null>(null)
const previewContent = ref<string>('')
const showPreview = ref(false) // 控制是否显示文件预览模块
const segmentPreview = ref<any[]>([]) // 存储分段预览数据
const isSegmentPreview = ref(false) // 标识当前是否为分段预览模式


const res = ref<UploadResponse[]>([])
const step = ref(1)

const process_rule = ref('custom')
const custom = ref({
    pre_processing_rules: [
        {
            id: "remove_extra_spaces",
            enabled: false
        }, {
            id: 'remove_urls_emails',
            enabled: false
        }
    ],
    segmentation: {
        separator: '\\n\\n',
        max_tokens: 500,
        chunk_overlap: 50,
    },

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

const retrieval_model = ref<RetrievalModel>({
    search_method: 'semantic_search',
    top_k: 5,
    reranking_enable: true,
    reranking_model: {
        reranking_model_name: 'gte-rerank-v2',
        reranking_provider_name: 'langgenius/tongyi/tongyi'
    },
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

const dataset = ref({})

const handleUploadChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    const type = uploadFile.name.replace(/.*\./, '')
    let regex = radio.value === 'datasets' ? [
        'doc', 'docx', 'txt', 'pdf', 'html', 'markdown', 'xls', 'xlsx'
    ] : ['csv']

    if (!regex.find(x => x === type)) {
        ElMessage.error('文件格式错误，请上传正确的文件格式')
        uploadFiles.pop()
        return
    }
    const formData = new FormData()
    if (uploadFile.raw) {
        formData.append('file', uploadFile.raw)
        uploadDocument(formData).then(response => {
            res.value.push(response)
            console.log('File uploaded successfully:', response)
        }).catch(error => {
            ElMessage.error(`文件上传失败${error}`)
            console.error('File upload failed:', error)
        })
    }
}

const handlePrev = () => {
    step.value -= 1
    // 从 step 2 返回到 step 1 时，重置预览状态
    if (step.value === 1) {
        showPreview.value = false
    }
}
const handleNext = () => {
    step.value += 1
    // 从 step 1 进入 step 2 时，清空文件预览内容
    if (step.value === 2) {
        previewContent.value = ''
        previewFile.value = null
        showPreview.value = false
    }
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
        doc_form: radio.value === 'datasets' ? 'text_model' : 'qa_model',
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
        dataset.value = res
        step.value = 3
    })
}

// 获取文件预览内容
const fetchFilePreview = async (fileId: string) => {
    if (!fileId) {
        previewContent.value = ''
        return
    }
    try {
        const response = await getFilesPreview(fileId)
        previewContent.value = response.content || '暂无预览内容'
    } catch (error) {
        console.error('获取文件预览失败:', error)
        ElMessage.error('获取文件预览失败')
        previewContent.value = '加载失败，请重试'
    }
}

//点击预览按钮
const handlePreviewButton = () => {
    if (res.value.length > 0) {
        // 根据当前选择的 process_rule 模式获取对应的配置
        const currentRules = custom.value

        const params: IndexingEstimateParams = {
            doc_form: 'text_model',
            doc_language: 'English',
            indexing_technique: indexing_technique.value,
            info_list: {
                data_source_type: 'upload_file',
                file_info_list: {
                    file_ids: res.value.map(x => x.id)
                }
            },
            process_rule: {
                mode: process_rule.value,
                rules: currentRules
            }
        }

        fetchFileIndexingEstimate(params).then(response => {
            console.log('分段预览结果:', response)
            // 处理返回的分段内容,且不为空的
            if (response && response.preview) {
                segmentPreview.value = response.preview
                isSegmentPreview.value = true
                ElMessage.success('分段预览加载成功')
            } else {
                ElMessage.warning('暂无分段预览数据')
            }
        }).catch(error => {
            console.error('获取分段预览失败:', error)
            ElMessage.error('获取分段预览失败')
        })
    } else {
        ElMessage.warning('请先上传文件')
    }
}

// 点击文件名显示预览
const handleFileClick = (fileId: string) => {
    if(step.value===1){
        showPreview.value = true // 显示预览模块
        previewFile.value = fileId // 选中该文件
    }
}

// 删除文件
const handleDeleteFile = (fileId: string) => {
    const index = res.value.findIndex(file => file.id === fileId)
    if (index > -1) {
        res.value.splice(index, 1)
        // 同时从 fileList 中删除
        const fileListIndex = fileList.value.findIndex(file => file.uid === fileId)
        if (fileListIndex > -1) {
            fileList.value.splice(fileListIndex, 1)
        }
        // 如果删除的是当前预览的文件，清空预览内容
        if (previewFile.value === fileId) {
            previewFile.value = null
            previewContent.value = ''
        }
        // 如果删除后没有文件了，隐藏预览模块
        if (res.value.length === 0) {
            showPreview.value = false
        }
        ElMessage.success('文件已删除')
    }
}

// 获取文件扩展名
const getFileExtension = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toUpperCase() || ''
    return ext
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toFixed(2) + sizes[i]
}

// watch侦听文件选择变化，自动获取预览内容
watch(previewFile, (newFileId) => {
    if (newFileId) {
        // 在 step 1 时，只获取文件原始内容
        if (step.value === 1) {
            fetchFilePreview(newFileId).then(response => {
                //previewContent.value = response.content
                console.log(response);
            }).catch(error => {
                console.error('获取文件预览失败:', error)
                previewContent.value = '加载失败，请重试'
            })
        } 
        // 在 step 2 时，获取分段预览
        else if (step.value === 2) {
            const params: IndexingEstimateParams = {
                doc_form: 'text_model',
                doc_language: 'English',
                indexing_technique: indexing_technique.value,
                info_list: {
                    data_source_type: 'upload_file',
                    file_info_list: {
                        file_ids: [newFileId]
                    }
                },
                process_rule: {
                    mode: process_rule.value,
                    rules: custom.value
                }
            }

            fetchFileIndexingEstimate(params).then(response => {
                console.log('分段预览结果:', response)
                // 处理返回的分段内容
                if (response && response.preview) {
                    segmentPreview.value = response.preview
                    isSegmentPreview.value = true
                } else {
                    segmentPreview.value = []
                    isSegmentPreview.value = false
                }
            }).catch(error => {
                console.error('获取分段预览失败:', error)
                segmentPreview.value = []
                isSegmentPreview.value = false
            })
        }
    } else {
        previewContent.value = ''
        segmentPreview.value = []
        isSegmentPreview.value = false
    }
})


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


</style>